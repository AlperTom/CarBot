/**
 * GDPR Compliance API Endpoints
 * Handles right to erasure, data portability, and consent management
 */

import { NextResponse } from 'next/server';
import { gdprComplianceAPI, gdprDataManager } from '../../../lib/gdpr-compliance';
import { withAuth } from '../../../lib/jwt-auth';
import { rateLimiter } from '../../../lib/security';

/**
 * POST /api/gdpr - Handle GDPR requests
 */
export async function POST(request) {
  try {
    // Rate limiting for GDPR requests
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rateLimitResult = await rateLimiter.checkRateLimit(
      `gdpr:${ip}`, 
      5, // 5 requests per hour
      3600000 // 1 hour
    );
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded for GDPR requests',
        retryAfter: Math.ceil((rateLimitResult.resetTime - new Date()) / 1000)
      }, { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitResult.resetTime - new Date()) / 1000).toString()
        }
      });
    }

    const body = await request.json();
    const { action, data } = body;

    let result;
    
    switch (action) {
      case 'right_to_erasure':
        result = await gdprComplianceAPI.handleErasureRequest(data);
        break;
        
      case 'data_portability':
        result = await gdprComplianceAPI.handleDataPortabilityRequest(data);
        break;
        
      case 'consent_update':
        result = await gdprComplianceAPI.handleConsentUpdate(data);
        break;
        
      case 'consent_withdrawal':
        result = await gdprComplianceAPI.handleConsentUpdate({
          ...data,
          granted: false
        });
        break;
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid GDPR action'
        }, { status: 400 });
    }

    // Log GDPR request for compliance
    console.log({
      timestamp: new Date().toISOString(),
      action,
      ip,
      success: result.success,
      user_id: data.user_id || data.email
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('GDPR API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * GET /api/gdpr - Get user's GDPR data or status
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('user_id');
    const email = searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json({
        success: false,
        error: 'User ID or email required'
      }, { status: 400 });
    }

    switch (action) {
      case 'data_export':
        const exportResult = await gdprComplianceAPI.handleDataPortabilityRequest({
          user_id: userId,
          email: email
        });
        
        if (exportResult.success) {
          // Return as downloadable JSON
          return new NextResponse(JSON.stringify(exportResult.exportData, null, 2), {
            headers: {
              'Content-Type': 'application/json',
              'Content-Disposition': `attachment; filename="carbot-data-export-${userId || email}.json"`
            }
          });
        } else {
          return NextResponse.json(exportResult, { status: 400 });
        }
        
      case 'consent_status':
        // Get current consent status (implementation needed)
        return NextResponse.json({
          success: true,
          consents: {
            essential: true,
            analytics: true,
            marketing: false,
            personalization: true
          }
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('GDPR GET API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/gdpr - Execute right to erasure
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const email = searchParams.get('email');
    const reason = searchParams.get('reason') || 'user_request';

    if (!userId && !email) {
      return NextResponse.json({
        success: false,
        error: 'User ID or email required'
      }, { status: 400 });
    }

    // Rate limiting for deletion requests
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rateLimitResult = await rateLimiter.checkRateLimit(
      `gdpr_delete:${ip}`, 
      2, // 2 deletions per day
      24 * 60 * 60 * 1000 // 24 hours
    );
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded for deletion requests',
        retryAfter: Math.ceil((rateLimitResult.resetTime - new Date()) / 1000)
      }, { status: 429 });
    }

    const result = await gdprComplianceAPI.handleErasureRequest({
      user_id: userId,
      email: email,
      reason: reason
    });

    // Log deletion request
    console.log({
      timestamp: new Date().toISOString(),
      action: 'right_to_erasure',
      ip,
      success: result.success,
      user_id: userId || email,
      reason
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('GDPR DELETE API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Admin endpoint for scheduled cleanup (protected)
export async function PUT(request) {
  try {
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.GDPR_ADMIN_TOKEN;
    
    if (!authHeader || !adminToken || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const { action } = await request.json();
    
    if (action === 'automated_cleanup') {
      console.log('🧹 Starting GDPR automated cleanup...');
      const results = await gdprDataManager.executeAutomatedCleanup();
      
      return NextResponse.json({
        success: true,
        message: 'Automated cleanup completed',
        results
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid admin action'
    }, { status: 400 });

  } catch (error) {
    console.error('GDPR admin API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}