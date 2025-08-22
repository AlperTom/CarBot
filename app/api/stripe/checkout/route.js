import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { 
  createCheckoutSession, 
  createStripeCustomer, 
  STRIPE_PRODUCTS,
  handleStripeError 
} from '@/lib/stripe';
import { supabase } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      planId,
      billingInterval = 'month',
      workshopData,
      customerData,
      trialDays = 14,
      successUrl,
      cancelUrl,
    } = body;

    // Validate required fields
    if (!planId || !workshopData || !customerData) {
      return NextResponse.json(
        { 
          error: 'Fehlende erforderliche Felder: planId, workshopData und customerData sind erforderlich.' 
        },
        { status: 400 }
      );
    }

    // Validate plan exists
    const product = STRIPE_PRODUCTS[planId];
    if (!product) {
      return NextResponse.json(
        { error: 'Ungültiger Plan ausgewählt.' },
        { status: 400 }
      );
    }

    // Get the origin for URL construction
    const headersList = headers();
    const origin = headersList.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Construct URLs
    const defaultSuccessUrl = `${origin}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}&success=true`;
    const defaultCancelUrl = `${origin}/pricing?canceled=true`;

    const sessionSuccessUrl = successUrl || defaultSuccessUrl;
    const sessionCancelUrl = cancelUrl || defaultCancelUrl;

    // Determine price ID based on interval
    const priceId = billingInterval === 'year' 
      ? process.env[`STRIPE_${planId.toUpperCase()}_YEARLY_PRICE_ID`]
      : process.env[`STRIPE_${planId.toUpperCase()}_MONTHLY_PRICE_ID`];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Preiskonfiguration für den gewählten Plan nicht gefunden.' },
        { status: 500 }
      );
    }

    // Check if customer already exists in our database
    let stripeCustomerId = null;
    const { data: existingWorkshop } = await supabase
      .from('workshops')
      .select('stripe_customer_id')
      .eq('owner_email', customerData.email)
      .single();

    if (existingWorkshop?.stripe_customer_id) {
      stripeCustomerId = existingWorkshop.stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await createStripeCustomer({
        email: customerData.email,
        name: customerData.name || workshopData.name,
        workshopName: workshopData.name,
        address: customerData.address ? {
          street: customerData.address,
          city: customerData.city,
          postalCode: customerData.postalCode,
          country: customerData.country || 'DE'
        } : undefined,
        taxId: customerData.vatNumber
      });

      stripeCustomerId = customer.id;

      // Update workshop with Stripe customer ID
      await supabase
        .from('workshops')
        .update({ 
          stripe_customer_id: stripeCustomerId,
          updated_at: new Date().toISOString()
        })
        .eq('owner_email', customerData.email);
    }

    // Create checkout session
    const session = await createCheckoutSession({
      priceId,
      customerId: stripeCustomerId,
      customerEmail: customerData.email,
      workshopId: workshopData.id,
      successUrl: sessionSuccessUrl,
      cancelUrl: sessionCancelUrl,
      trialPeriodDays: trialDays,
      userId: workshopData.owner_id || workshopData.id // Pass user ID for validation
    });

    // Log checkout session creation
    await supabase
      .from('billing_events')
      .insert({
        workshop_id: workshopData.id,
        event_type: 'checkout_session_created',
        stripe_session_id: session.id,
        plan_id: planId,
        billing_interval: billingInterval,
        amount: product[billingInterval === 'year' ? 'yearly' : 'monthly'].price,
        currency: 'eur',
        metadata: {
          customer_id: stripeCustomerId,
          trial_days: trialDays,
        },
        created_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      customerId: stripeCustomerId,
    });

  } catch (error) {
    console.error('Checkout API Error:', error);
    
    const stripeError = handleStripeError(error);
    return NextResponse.json(
      { 
        error: stripeError.message,
        type: stripeError.type,
        code: stripeError.code 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve session details
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID ist erforderlich.' },
        { status: 400 }
      );
    }

    // Import stripe here to avoid issues
    const { stripe } = await import('@/lib/stripe');
    
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    // Extract relevant information
    const sessionData = {
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
      customerId: session.customer,
      subscriptionId: session.subscription?.id,
      amount: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
    };

    return NextResponse.json({
      success: true,
      session: sessionData,
    });

  } catch (error) {
    console.error('Get Checkout Session Error:', error);
    
    const stripeError = handleStripeError(error);
    return NextResponse.json(
      { 
        error: stripeError.message,
        type: stripeError.type 
      },
      { status: 500 }
    );
  }
}