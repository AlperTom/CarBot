/**
 * Database Helper for CarBot E2E Tests
 * Manages test data creation, cleanup, and verification
 */

const { createClient } = require('@supabase/supabase-js');

class DatabaseHelper {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  /**
   * Tests database connection
   */
  async testConnection() {
    try {
      const { data, error } = await this.supabase
        .from('workshops')
        .select('count', { count: 'exact' })
        .limit(1);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  /**
   * Creates a test workshop in the database
   */
  async createTestWorkshop(workshopData) {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await this.supabase.auth.admin.createUser({
        email: workshopData.email,
        password: workshopData.password,
        email_confirm: true,
        user_metadata: {
          name: workshopData.name,
          role: 'workshop_owner'
        }
      });

      if (authError) throw authError;

      // Then create the workshop record
      const { data: workshop, error: workshopError } = await this.supabase
        .from('workshops')
        .insert({
          id: workshopData.id,
          owner_id: authData.user.id,
          owner_email: workshopData.email,
          name: workshopData.name,
          phone: workshopData.phone,
          address: workshopData.address,
          city: workshopData.city,
          plz: workshopData.plz,
          business_type: workshopData.businessType,
          subscription_plan: workshopData.plan,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (workshopError) throw workshopError;

      console.log(`✅ Test workshop created: ${workshop.name} (${workshop.subscription_plan})`);
      return { user: authData.user, workshop };

    } catch (error) {
      console.error(`❌ Failed to create test workshop:`, error);
      throw error;
    }
  }

  /**
   * Creates test leads for a workshop
   */
  async createTestLead(workshopId, leadData) {
    try {
      const { data: lead, error } = await this.supabase
        .from('leads')
        .insert({
          kunde_id: workshopId,
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          anliegen: leadData.anliegen,
          fahrzeug: leadData.fahrzeug,
          km_stand: leadData.kmStand,
          priority: leadData.priority,
          status: 'new',
          source: 'chat_widget',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Test lead created: ${lead.name} for workshop ${workshopId}`);
      return lead;

    } catch (error) {
      console.error(`❌ Failed to create test lead:`, error);
      throw error;
    }
  }

  /**
   * Creates chat messages for testing
   */
  async createChatMessage(clientKey, message, isUser = true) {
    try {
      const { data: chatMessage, error } = await this.supabase
        .from('chat_messages')
        .insert({
          client_key: clientKey,
          message: message,
          is_user_message: isUser,
          message_type: 'text',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return chatMessage;

    } catch (error) {
      console.error(`❌ Failed to create chat message:`, error);
      throw error;
    }
  }

  /**
   * Verifies workshop package features
   */
  async verifyWorkshopPackage(workshopId, expectedPackage) {
    try {
      const { data: workshop, error } = await this.supabase
        .from('workshops')
        .select('subscription_plan, current_period_start, current_period_end')
        .eq('id', workshopId)
        .single();

      if (error) throw error;

      return {
        matches: workshop.subscription_plan === expectedPackage,
        current: workshop.subscription_plan,
        expected: expectedPackage,
        periodStart: workshop.current_period_start,
        periodEnd: workshop.current_period_end
      };

    } catch (error) {
      console.error(`❌ Failed to verify workshop package:`, error);
      throw error;
    }
  }

  /**
   * Gets current usage for a workshop
   */
  async getWorkshopUsage(workshopId) {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: usage, error } = await this.supabase
        .from('usage_tracking')
        .select('metric_name, quantity')
        .eq('workshop_id', workshopId)
        .gte('created_at', startOfMonth.toISOString());

      if (error) throw error;

      const usageMap = {};
      usage.forEach(u => {
        usageMap[u.metric_name] = (usageMap[u.metric_name] || 0) + u.quantity;
      });

      return usageMap;

    } catch (error) {
      console.error(`❌ Failed to get workshop usage:`, error);
      throw error;
    }
  }

  /**
   * Verifies email notifications were sent
   */
  async verifyEmailNotification(workshopId, type) {
    try {
      const { data: notifications, error } = await this.supabase
        .from('email_notifications')
        .select('*')
        .eq('workshop_id', workshopId)
        .eq('notification_type', type)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      return {
        found: notifications.length > 0,
        notification: notifications[0] || null
      };

    } catch (error) {
      console.error(`❌ Failed to verify email notification:`, error);
      throw error;
    }
  }

  /**
   * Cleans up all test data
   */
  async cleanupTestData() {
    try {
      console.log('🧹 Starting database cleanup...');

      // Delete test chat messages
      await this.supabase
        .from('chat_messages')
        .delete()
        .like('client_key', 'test-%');

      // Delete test leads
      await this.supabase
        .from('leads')
        .delete()
        .like('kunde_id', 'test-%');

      // Delete test usage tracking
      await this.supabase
        .from('usage_tracking')
        .delete()
        .like('workshop_id', 'test-%');

      // Delete test email notifications
      await this.supabase
        .from('email_notifications')
        .delete()
        .like('workshop_id', 'test-%');

      // Delete test workshops
      const { data: workshops } = await this.supabase
        .from('workshops')
        .select('owner_id')
        .like('id', 'test-%');

      if (workshops && workshops.length > 0) {
        // Delete workshop records
        await this.supabase
          .from('workshops')
          .delete()
          .like('id', 'test-%');

        // Delete auth users
        for (const workshop of workshops) {
          try {
            await this.supabase.auth.admin.deleteUser(workshop.owner_id);
          } catch (error) {
            console.warn(`⚠️ Could not delete auth user ${workshop.owner_id}:`, error.message);
          }
        }
      }

      console.log('✅ Database cleanup completed');

    } catch (error) {
      console.error('❌ Database cleanup failed:', error);
      // Don't throw - cleanup failures shouldn't fail tests
    }
  }

  /**
   * Seeds test data for specific test scenarios
   */
  async seedTestData(scenario) {
    const scenarios = {
      'basic-workshop-full-usage': async () => {
        // Create basic workshop at 95/100 lead limit
        const workshop = await this.createTestWorkshop({
          id: 'test-workshop-basic-full',
          email: 'test-full@carbot-e2e.de',
          password: 'TestFull123!',
          name: 'Test Full Usage Workshop',
          plan: 'basic'
        });

        // Create 95 leads to test limit
        for (let i = 1; i <= 95; i++) {
          await this.createTestLead(workshop.workshop.id, {
            name: `Test Lead ${i}`,
            email: `lead${i}@test.de`,
            phone: `+49 173 000${String(i).padStart(4, '0')}`,
            anliegen: 'Test Service Request',
            fahrzeug: 'Test Vehicle',
            kmStand: '50000'
          });
        }

        return workshop;
      },

      'professional-workshop-api-usage': async () => {
        // Create professional workshop with API usage
        const workshop = await this.createTestWorkshop({
          id: 'test-workshop-pro-api',
          email: 'test-api@carbot-e2e.de',
          password: 'TestAPI123!',
          name: 'Test API Workshop',
          plan: 'professional'
        });

        // Record API usage
        await this.supabase
          .from('usage_tracking')
          .insert({
            workshop_id: workshop.workshop.id,
            metric_name: 'api_calls',
            quantity: 500,
            created_at: new Date().toISOString()
          });

        return workshop;
      }
    };

    if (scenarios[scenario]) {
      return await scenarios[scenario]();
    } else {
      throw new Error(`Unknown test scenario: ${scenario}`);
    }
  }
}

module.exports = { DatabaseHelper };