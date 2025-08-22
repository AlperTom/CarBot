import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createPortalSession, handleStripeError } from '@/lib/stripe';
import { supabase } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { workshopId, customerId, returnUrl } = body;

    // Validate required fields
    if (!workshopId && !customerId) {
      return NextResponse.json(
        { error: 'Workshop ID oder Customer ID ist erforderlich.' },
        { status: 400 }
      );
    }

    // Get the origin for URL construction
    const headersList = headers();
    const origin = headersList.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Construct return URL
    const defaultReturnUrl = `${origin}/dashboard/billing`;
    const sessionReturnUrl = returnUrl || defaultReturnUrl;

    let stripeCustomerId = customerId;

    // If workshop ID is provided, get the customer ID from the database
    if (workshopId && !customerId) {
      const { data: workshop, error } = await supabase
        .from('workshops')
        .select('stripe_customer_id, name')
        .eq('id', workshopId)
        .single();

      if (error) {
        console.error('Error fetching workshop:', error);
        return NextResponse.json(
          { error: 'Werkstatt nicht gefunden.' },
          { status: 404 }
        );
      }

      if (!workshop.stripe_customer_id) {
        return NextResponse.json(
          { error: 'Kein Stripe-Kunde für diese Werkstatt gefunden. Bitte erstellen Sie zuerst ein Abonnement.' },
          { status: 404 }
        );
      }

      stripeCustomerId = workshop.stripe_customer_id;
    }

    // Create portal session
    const session = await createCustomerPortalSession(stripeCustomerId, sessionReturnUrl);

    // Log portal access
    if (workshopId) {
      await supabase
        .from('billing_events')
        .insert({
          workshop_id: workshopId,
          event_type: 'portal_accessed',
          stripe_customer_id: stripeCustomerId,
          metadata: {
            return_url: sessionReturnUrl,
            user_agent: headers().get('user-agent'),
            ip_address: headers().get('x-forwarded-for') || headers().get('x-real-ip'),
          },
          created_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('Portal API Error:', error);
    
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

// GET endpoint to check portal session status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const workshopId = searchParams.get('workshop_id');

    if (!sessionId && !workshopId) {
      return NextResponse.json(
        { error: 'Session ID oder Workshop ID ist erforderlich.' },
        { status: 400 }
      );
    }

    // If workshop ID is provided, get recent portal sessions
    if (workshopId) {
      const { data: events, error } = await supabase
        .from('billing_events')
        .select('*')
        .eq('workshop_id', workshopId)
        .eq('event_type', 'portal_accessed')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching portal events:', error);
        return NextResponse.json(
          { error: 'Fehler beim Abrufen der Portal-Historie.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        events: events || [],
      });
    }

    // If session ID is provided, get session details from Stripe
    if (sessionId) {
      // Import stripe here to avoid issues
      const { stripe } = await import('@/lib/stripe');
      
      try {
        const session = await stripe.billingPortal.sessions.retrieve(sessionId);
        
        return NextResponse.json({
          success: true,
          session: {
            id: session.id,
            customer: session.customer,
            returnUrl: session.return_url,
            url: session.url,
            created: session.created,
            livemode: session.livemode,
          },
        });
      } catch (stripeError) {
        if (stripeError.code === 'resource_missing') {
          return NextResponse.json(
            { error: 'Portal-Session nicht gefunden.' },
            { status: 404 }
          );
        }
        throw stripeError;
      }
    }

  } catch (error) {
    console.error('Get Portal Session Error:', error);
    
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