# CarBot MVP - Technical Requirements Document
## Version 1.0 | Date: 2025-08-06

---

## 🏗️ SYSTEM ARCHITECTURE

### High-Level Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Widget │    │  Landing Pages  │    │ Admin Dashboard │
│   (JavaScript)  │    │   (Templates)   │    │   (React SPA)   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼───────────┐
                    │       API Gateway       │
                    │    (Express.js/NestJS)  │
                    └─────────────┬───────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────▼───────┐    ┌─────────▼───────┐    ┌─────────▼───────┐
│  Auth Service   │    │  Client Key     │    │ Template Engine │
│   (JWT + RBAC)  │    │   Management    │    │  (Handlebars)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼───────────┐
                    │    PostgreSQL Database   │
                    │  (Primary + Read Replica)│
                    └─────────────────────────┘
```

---

## 🔧 TECHNOLOGY STACK

### Backend Technologies
- **Runtime**: Node.js 18+ (LTS)
- **Framework**: NestJS (TypeScript) with Express
- **Database**: PostgreSQL 14+ with Prisma ORM
- **Authentication**: JWT with refresh tokens + bcrypt
- **Caching**: Redis for session management and rate limiting
- **File Storage**: AWS S3 for template assets and user uploads
- **Message Queue**: Bull Queue with Redis for background jobs

### Frontend Technologies
- **Admin Dashboard**: React 18 + TypeScript + Vite
- **UI Framework**: Material-UI (MUI) v5 with custom theme
- **State Management**: Zustand for simple state management
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios with automatic retry logic
- **Widget**: Vanilla JavaScript ES6+ (no framework dependencies)

### Infrastructure & DevOps
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (production) or Docker Swarm (staging)
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Monitoring**: Prometheus + Grafana + Winston logging
- **CDN**: CloudFlare for global content delivery
- **SSL/TLS**: Let's Encrypt with automatic renewal

---

## 📊 DATABASE ARCHITECTURE

### Database Design Principles
- **Normalized Design**: 3NF compliance with strategic denormalization
- **Performance First**: Optimized indexes for query patterns
- **Scalability**: Designed for horizontal scaling with read replicas
- **Security**: Column-level encryption for sensitive data

### Complete Schema Definition
```sql
-- Users and Authentication
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    phone VARCHAR(20),
    subscription_tier VARCHAR(20) NOT NULL DEFAULT 'basic',
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'active',
    trial_ends_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- Client Keys Management
CREATE TABLE client_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key_value VARCHAR(255) UNIQUE NOT NULL,
    key_hash VARCHAR(255) NOT NULL, -- bcrypt hash for security
    domain VARCHAR(255) NOT NULL,
    domain_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    usage_limit INTEGER NOT NULL,
    current_usage INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 year'),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Landing Page Templates
CREATE TABLE templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    preview_image_url VARCHAR(500),
    template_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Landing Pages
CREATE TABLE landing_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_id VARCHAR(50) REFERENCES templates(id),
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    custom_domain VARCHAR(255) UNIQUE,
    ssl_enabled BOOLEAN DEFAULT false,
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo_settings JSONB DEFAULT '{}'::jsonb,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_key_id UUID REFERENCES client_keys(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    user_identifier VARCHAR(255), -- IP hash or user ID
    message_count INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Individual Chat Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics and Metrics
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_key_id UUID REFERENCES client_keys(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_category VARCHAR(50),
    event_data JSONB DEFAULT '{}'::jsonb,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment and Billing
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    plan_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    trial_start TIMESTAMP,
    trial_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Domain Verification
CREATE TABLE domain_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    landing_page_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    verification_token VARCHAR(255) NOT NULL,
    verification_method VARCHAR(50) NOT NULL, -- 'dns', 'file', 'meta'
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_client_keys_user_id ON client_keys(user_id);
CREATE INDEX idx_client_keys_domain ON client_keys(domain);
CREATE INDEX idx_client_keys_active ON client_keys(is_active) WHERE is_active = true;
CREATE INDEX idx_landing_pages_user_id ON landing_pages(user_id);
CREATE INDEX idx_landing_pages_subdomain ON landing_pages(subdomain);
CREATE INDEX idx_landing_pages_custom_domain ON landing_pages(custom_domain);
CREATE INDEX idx_conversations_client_key_id ON conversations(client_key_id);
CREATE INDEX idx_conversations_started_at ON conversations(started_at);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_analytics_events_client_key_id ON analytics_events(client_key_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_type_category ON analytics_events(event_type, event_category);

-- Full-text search indexes
CREATE INDEX idx_messages_content_fts ON messages USING gin(to_tsvector('german', content));
CREATE INDEX idx_templates_search ON templates USING gin(to_tsvector('english', name || ' ' || description));
```

### Data Migration Strategy
```sql
-- Migration versioning system
CREATE TABLE schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example migration for adding new features
-- Migration: 001_add_template_categories.sql
ALTER TABLE templates ADD COLUMN category VARCHAR(100);
CREATE INDEX idx_templates_category ON templates(category);
INSERT INTO schema_migrations (version) VALUES ('001_add_template_categories');
```

---

## 🔌 API ARCHITECTURE

### RESTful API Design Principles
- **Resource-Based URLs**: `/api/v1/resources/{id}`
- **HTTP Methods**: GET, POST, PUT, PATCH, DELETE
- **Status Codes**: Semantic HTTP status codes
- **Pagination**: Cursor-based pagination for large datasets
- **Versioning**: URL path versioning (`/api/v1/`, `/api/v2/`)

### Authentication & Authorization Flow
```typescript
// JWT Token Structure
interface JWTPayload {
  sub: string; // user ID
  email: string;
  tier: 'basic' | 'premium' | 'enterprise';
  permissions: string[];
  iat: number;
  exp: number;
  type: 'access' | 'refresh';
}

// Role-Based Access Control
const permissions = {
  basic: ['read:own_keys', 'create:own_keys', 'read:own_analytics'],
  premium: ['*:own_keys', '*:own_landing_pages', 'read:templates'],
  enterprise: ['*:*', 'admin:users', 'admin:system']
};
```

### API Rate Limiting Strategy
```typescript
// Rate limiting configuration per tier
const rateLimits = {
  basic: {
    requests: 100,
    window: '15m',
    skipSuccessfulRequests: false
  },
  premium: {
    requests: 500,
    window: '15m',
    skipSuccessfulRequests: true
  },
  enterprise: {
    requests: 2000,
    window: '15m',
    skipSuccessfulRequests: true
  }
};

// Client key specific rate limits
const clientKeyLimits = {
  basic: { conversations: 1000, messages: 10000 },
  premium: { conversations: 5000, messages: 50000 },
  enterprise: { conversations: -1, messages: -1 } // unlimited
};
```

### Core API Endpoints Specification

#### Authentication Endpoints
```typescript
// POST /api/v1/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

interface RegisterResponse {
  user: UserProfile;
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

// POST /api/v1/auth/login
interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

// POST /api/v1/auth/refresh
interface RefreshRequest {
  refresh_token: string;
}
```

#### Client Key Management Endpoints
```typescript
// POST /api/v1/client-keys
interface CreateClientKeyRequest {
  domain: string;
  description?: string;
  usage_limit?: number; // override default based on tier
}

interface CreateClientKeyResponse {
  id: string;
  key: string; // full key value, only shown once
  domain: string;
  usage_limit: number;
  created_at: string;
}

// GET /api/v1/client-keys
interface ListClientKeysResponse {
  keys: Array<{
    id: string;
    domain: string;
    is_active: boolean;
    current_usage: number;
    usage_limit: number;
    last_used_at?: string;
    created_at: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    has_more: boolean;
  };
}

// GET /api/v1/client-keys/{keyId}/analytics
interface KeyAnalyticsResponse {
  usage_stats: {
    current_period: {
      conversations: number;
      messages: number;
      unique_users: number;
    };
    previous_period: {
      conversations: number;
      messages: number;
      unique_users: number;
    };
    growth_rate: number;
  };
  top_intents: Array<{
    intent: string;
    count: number;
    percentage: number;
  }>;
  hourly_usage: Array<{
    hour: string;
    conversations: number;
  }>;
}
```

#### Landing Page Management Endpoints
```typescript
// GET /api/v1/templates
interface ListTemplatesResponse {
  templates: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    preview_image_url: string;
    features: string[];
  }>;
}

// POST /api/v1/landing-pages
interface CreateLandingPageRequest {
  template_id: string;
  subdomain: string;
  configuration: {
    business_name: string;
    business_description: string;
    contact_info: ContactInfo;
    theme: ThemeSettings;
    seo: SEOSettings;
  };
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: BusinessHours;
  location: {
    lat: number;
    lng: number;
  };
}

interface ThemeSettings {
  primary_color: string;
  secondary_color: string;
  font_family: string;
  logo_url?: string;
  favicon_url?: string;
}

interface SEOSettings {
  meta_title: string;
  meta_description: string;
  keywords: string[];
  schema_type: 'AutoRepair' | 'CarDealer' | 'LocalBusiness';
}
```

#### Widget API Endpoints
```typescript
// POST /api/v1/widget/chat
interface WidgetChatRequest {
  client_key: string;
  session_id: string;
  message: string;
  context?: {
    page_url: string;
    user_agent: string;
    locale: string;
  };
}

interface WidgetChatResponse {
  response: string;
  session_id: string;
  conversation_id: string;
  suggestions?: string[];
  typing_delay?: number;
}

// POST /api/v1/widget/init
interface WidgetInitRequest {
  client_key: string;
  domain: string;
  config?: WidgetConfig;
}

interface WidgetConfig {
  theme: 'light' | 'dark' | 'auto';
  position: 'bottom-right' | 'bottom-left' | 'center';
  greeting_message: string;
  placeholder_text: string;
  primary_color: string;
  avatar_url?: string;
}
```

---

## 🔐 SECURITY ARCHITECTURE

### Security-First Design Principles
- **Defense in Depth**: Multiple security layers
- **Principle of Least Privilege**: Minimal access rights
- **Input Validation**: Server-side validation for all inputs
- **Output Encoding**: XSS prevention through proper encoding
- **Secure Communication**: HTTPS/TLS everywhere

### Client Key Security Implementation
```typescript
// Client key generation with cryptographic security
import crypto from 'crypto';
import bcrypt from 'bcrypt';

class ClientKeyService {
  generateClientKey(userId: string, environment: 'prod' | 'test' = 'prod'): string {
    // Generate cryptographically secure random bytes
    const randomBytes = crypto.randomBytes(32);
    const keyHash = crypto.createHash('sha256').update(randomBytes).digest('hex');
    
    // Format: cb_[env]_[32_char_hash]
    return `cb_${environment}_${keyHash.substring(0, 32)}`;
  }

  async hashClientKey(clientKey: string): Promise<string> {
    // Use bcrypt for secure hashing (rounds: 12)
    return bcrypt.hash(clientKey, 12);
  }

  async validateClientKey(clientKey: string, hashedKey: string): Promise<boolean> {
    return bcrypt.compare(clientKey, hashedKey);
  }

  // Domain verification for key activation
  async verifyDomain(clientKey: string, domain: string): Promise<boolean> {
    try {
      const response = await fetch(`https://${domain}/.well-known/carbot-verification`);
      const verificationData = await response.text();
      return verificationData.includes(clientKey);
    } catch {
      return false;
    }
  }
}
```

### GDPR Compliance Implementation
```typescript
// Data subject rights implementation
class GDPRService {
  // Right to access (Article 15)
  async exportUserData(userId: string): Promise<UserDataExport> {
    const userData = await this.collectAllUserData(userId);
    return {
      personal_data: userData.profile,
      conversations: userData.conversations,
      analytics: userData.analytics,
      created_at: new Date().toISOString(),
      format: 'JSON'
    };
  }

  // Right to erasure (Article 17)
  async deleteUserData(userId: string, retentionOverride = false): Promise<void> {
    // Soft delete with 30-day grace period unless override
    await this.markUserForDeletion(userId, retentionOverride);
    
    // Anonymize conversations instead of deleting for analytics
    await this.anonymizeUserConversations(userId);
    
    // Schedule permanent deletion job
    await this.schedulePermamentDeletion(userId, retentionOverride ? 0 : 30);
  }

  // Data portability (Article 20)
  async generatePortabilityExport(userId: string): Promise<PortabilityExport> {
    return {
      user_profile: await this.getUserProfile(userId),
      client_keys: await this.getUserClientKeys(userId),
      landing_pages: await this.getUserLandingPages(userId),
      conversations: await this.getPortableConversations(userId),
      export_format: 'JSON',
      machine_readable: true
    };
  }
}
```

### Input Validation & Sanitization
```typescript
// Comprehensive input validation using Zod
import { z } from 'zod';

const CreateClientKeySchema = z.object({
  domain: z.string()
    .min(3, 'Domain must be at least 3 characters')
    .max(255, 'Domain too long')
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, 'Invalid domain format')
    .refine(async (domain) => {
      // Check domain is not on blocklist
      return !await this.isDomainBlocked(domain);
    }, 'Domain is not allowed'),
  
  description: z.string()
    .max(500, 'Description too long')
    .optional()
    .transform(val => val ? DOMPurify.sanitize(val) : val),
    
  usage_limit: z.number()
    .int()
    .min(100, 'Minimum 100 requests')
    .max(1000000, 'Maximum 1M requests')
    .optional()
});

// XSS Prevention middleware
const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  next();
};
```

### Rate Limiting & DDoS Protection
```typescript
// Advanced rate limiting with Redis
import { RateLimiterRedis } from 'rate-limiter-flexible';

class AdvancedRateLimiter {
  private clientKeyLimiter: RateLimiterRedis;
  private ipLimiter: RateLimiterRedis;
  private bruteForceProtection: RateLimiterRedis;

  constructor() {
    // Per client key rate limiting
    this.clientKeyLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'client_key_limit',
      points: 1000, // requests
      duration: 3600, // per hour
      blockDuration: 3600, // block for 1 hour if exceeded
    });

    // Per IP rate limiting
    this.ipLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'ip_limit',
      points: 100, // requests
      duration: 900, // per 15 minutes
      blockDuration: 900,
    });

    // Brute force protection for authentication
    this.bruteForceProtection = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'brute_force',
      points: 5, // failed attempts
      duration: 900, // per 15 minutes
      blockDuration: 3600, // block for 1 hour
    });
  }

  async checkClientKeyLimit(clientKey: string): Promise<void> {
    try {
      await this.clientKeyLimiter.consume(clientKey);
    } catch (rejRes) {
      throw new TooManyRequestsError(`Rate limit exceeded. Try again in ${rejRes.msBeforeNext}ms`);
    }
  }
}
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### Caching Strategy
```typescript
// Multi-layer caching implementation
class CacheService {
  private redis: Redis;
  private memoryCache: NodeCache;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
    this.memoryCache = new NodeCache({ stdTTL: 300 }); // 5 minute default
  }

  // Template caching with hierarchical invalidation
  async cacheTemplate(templateId: string, templateData: any, ttl = 3600): Promise<void> {
    const cacheKey = `template:${templateId}`;
    
    // Cache in memory for ultra-fast access
    this.memoryCache.set(cacheKey, templateData, ttl);
    
    // Cache in Redis for distributed access
    await this.redis.setex(cacheKey, ttl, JSON.stringify(templateData));
    
    // Add to template index for bulk invalidation
    await this.redis.sadd('template:index', templateId);
  }

  // Client key validation caching
  async cacheClientKeyValidation(clientKey: string, isValid: boolean): Promise<void> {
    const cacheKey = `key_validation:${clientKey}`;
    await this.redis.setex(cacheKey, 300, isValid ? '1' : '0'); // 5 minute cache
  }

  // Conversation context caching
  async cacheConversationContext(sessionId: string, context: any): Promise<void> {
    const cacheKey = `conversation:${sessionId}`;
    await this.redis.setex(cacheKey, 1800, JSON.stringify(context)); // 30 minute cache
  }
}
```

### Database Query Optimization
```sql
-- Optimized queries with proper indexing
-- Landing page lookup with user tier check
EXPLAIN (ANALYZE, BUFFERS) 
SELECT lp.*, t.name as template_name, u.subscription_tier
FROM landing_pages lp
JOIN templates t ON lp.template_id = t.id
JOIN users u ON lp.user_id = u.id
WHERE lp.subdomain = $1 AND lp.is_published = true;

-- Client key validation with usage check
EXPLAIN (ANALYZE, BUFFERS)
SELECT ck.*, u.subscription_tier
FROM client_keys ck
JOIN users u ON ck.user_id = u.id
WHERE ck.key_hash = $1 AND ck.is_active = true AND ck.expires_at > NOW();

-- Analytics aggregation with time-based partitioning
SELECT 
    DATE_TRUNC('hour', created_at) as hour,
    COUNT(*) as conversation_count,
    COUNT(DISTINCT user_identifier) as unique_users
FROM conversations
WHERE client_key_id = $1 
    AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;
```

### CDN Configuration
```yaml
# CloudFlare configuration for optimal performance
cloudflare_config:
  cache_rules:
    - pattern: "/widget.js"
      cache_level: "aggressive"
      ttl: 86400 # 24 hours
      minify: true
      
    - pattern: "/templates/*"
      cache_level: "standard" 
      ttl: 3600 # 1 hour
      compress: true
      
    - pattern: "/api/v1/widget/init"
      cache_level: "bypass"
      security_level: "high"
      
  performance:
    minification:
      css: true
      js: true
      html: true
    compression: true
    http2: true
    brotli: true
    
  security:
    ssl: "flexible"
    always_use_https: true
    automatic_https_rewrites: true
    security_level: "medium"
    challenge_passage: 30
```

---

## 🧪 TESTING ARCHITECTURE

### Testing Strategy Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    Testing Pyramid                          │
├─────────────────────────────────────────────────────────────┤
│  E2E Tests (10%)        │  Full user journeys              │
│  - Playwright           │  - Template customization       │
│  - Real browser testing │  - Widget integration           │
├─────────────────────────────────────────────────────────────┤
│  Integration Tests (30%) │  API endpoints & database      │
│  - Supertest            │  - Client key management        │
│  - Test database        │  - Landing page CRUD            │
├─────────────────────────────────────────────────────────────┤
│  Unit Tests (60%)       │  Individual functions/classes   │
│  - Jest                 │  - Business logic               │
│  - Mock external deps   │  - Utility functions            │
└─────────────────────────────────────────────────────────────┘
```

### Unit Testing Framework
```typescript
// Example unit test for client key service
import { ClientKeyService } from '../services/ClientKeyService';
import { MockDatabase } from '../test-utils/MockDatabase';

describe('ClientKeyService', () => {
  let service: ClientKeyService;
  let mockDb: MockDatabase;

  beforeEach(() => {
    mockDb = new MockDatabase();
    service = new ClientKeyService(mockDb);
  });

  describe('generateClientKey', () => {
    it('should generate unique key with correct format', () => {
      const userId = 'user-123';
      const clientKey = service.generateClientKey(userId, 'prod');
      
      expect(clientKey).toMatch(/^cb_prod_[a-f0-9]{32}$/);
      expect(clientKey).toHaveLength(44); // cb_prod_ + 32 chars
    });

    it('should generate different keys for same user', () => {
      const userId = 'user-123';
      const key1 = service.generateClientKey(userId);
      const key2 = service.generateClientKey(userId);
      
      expect(key1).not.toBe(key2);
    });
  });

  describe('validateClientKey', () => {
    it('should validate active key correctly', async () => {
      const mockKey = {
        id: 'key-123',
        key_hash: 'hashed_key',
        is_active: true,
        expires_at: new Date(Date.now() + 86400000)
      };
      
      mockDb.clientKeys.findByHash.mockResolvedValue(mockKey);
      
      const isValid = await service.validateClientKey('test-key');
      expect(isValid).toBe(true);
    });

    it('should reject expired key', async () => {
      const mockKey = {
        id: 'key-123',
        key_hash: 'hashed_key',
        is_active: true,
        expires_at: new Date(Date.now() - 86400000) // expired
      };
      
      mockDb.clientKeys.findByHash.mockResolvedValue(mockKey);
      
      const isValid = await service.validateClientKey('test-key');
      expect(isValid).toBe(false);
    });
  });
});
```

### Integration Testing Framework
```typescript
// API integration testing with Supertest
import request from 'supertest';
import { app } from '../app';
import { setupTestDatabase, cleanupTestDatabase } from '../test-utils/database';

describe('Client Key API', () => {
  let authToken: string;
  let testUser: any;

  beforeAll(async () => {
    await setupTestDatabase();
    
    // Create test user and get auth token
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePassword123!',
        firstName: 'Test',
        lastName: 'User'
      });
      
    authToken = response.body.tokens.access_token;
    testUser = response.body.user;
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/v1/client-keys', () => {
    it('should create new client key for authenticated user', async () => {
      const response = await request(app)
        .post('/api/v1/client-keys')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          domain: 'example.com',
          description: 'Test website key'
        })
        .expect(201);

      expect(response.body).toHaveProperty('key');
      expect(response.body.key).toMatch(/^cb_prod_[a-f0-9]{32}$/);
      expect(response.body.domain).toBe('example.com');
    });

    it('should reject duplicate domain for same user', async () => {
      // First key creation
      await request(app)
        .post('/api/v1/client-keys')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ domain: 'duplicate.com' })
        .expect(201);

      // Duplicate domain should fail
      await request(app)
        .post('/api/v1/client-keys')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ domain: 'duplicate.com' })
        .expect(409);
    });
  });

  describe('GET /api/v1/client-keys/{keyId}/analytics', () => {
    it('should return analytics for key owner', async () => {
      // Create test conversations and messages
      await createTestAnalyticsData(testClientKey.id);
      
      const response = await request(app)
        .get(`/api/v1/client-keys/${testClientKey.id}/analytics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('usage_stats');
      expect(response.body.usage_stats).toHaveProperty('current_period');
      expect(response.body).toHaveProperty('hourly_usage');
    });
  });
});
```

### End-to-End Testing with Playwright
```typescript
// E2E test for complete user journey
import { test, expect } from '@playwright/test';

test.describe('Landing Page Creation Flow', () => {
  test('user can create and customize landing page', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[data-testid=email-input]', 'premium@example.com');
    await page.fill('[data-testid=password-input]', 'SecurePassword123!');
    await page.click('[data-testid=login-button]');
    
    // Navigate to landing page creation
    await page.click('[data-testid=create-landing-page]');
    await expect(page).toHaveURL('/landing-pages/create');
    
    // Select template
    await page.click('[data-testid=template-modern-minimalist]');
    await page.click('[data-testid=select-template-button]');
    
    // Customize template
    await page.fill('[data-testid=business-name]', 'Test Auto Workshop');
    await page.fill('[data-testid=business-description]', 'Professional car repair services');
    await page.fill('[data-testid=subdomain]', 'test-workshop');
    
    // Upload logo
    await page.setInputFiles('[data-testid=logo-upload]', 'test-assets/logo.png');
    await expect(page.locator('[data-testid=logo-preview]')).toBeVisible();
    
    // Customize colors
    await page.fill('[data-testid=primary-color]', '#007bff');
    
    // Preview template
    await page.click('[data-testid=preview-button]');
    await expect(page.locator('[data-testid=preview-iframe]')).toBeVisible();
    
    // Publish landing page
    await page.click('[data-testid=publish-button]');
    await expect(page.locator('[data-testid=success-message]')).toContainText('Landing page published successfully');
    
    // Verify published page is accessible
    await page.goto('https://test-workshop.carbot.ai');
    await expect(page.locator('h1')).toContainText('Test Auto Workshop');
  });

  test('widget integration works correctly', async ({ page }) => {
    // Navigate to published landing page
    await page.goto('https://test-workshop.carbot.ai');
    
    // Verify widget loads
    await expect(page.locator('[data-carbot-widget]')).toBeVisible();
    
    // Open chat widget
    await page.click('[data-testid=chat-widget-trigger]');
    await expect(page.locator('[data-testid=chat-interface]')).toBeVisible();
    
    // Send test message
    await page.fill('[data-testid=chat-input]', 'Hallo, ich brauche Hilfe mit meinem Auto');
    await page.press('[data-testid=chat-input]', 'Enter');
    
    // Verify response
    await expect(page.locator('[data-testid=chat-message]:last-child')).not.toBeEmpty();
    
    // Verify analytics tracking
    await page.waitForTimeout(1000); // Allow analytics to be sent
    // Analytics verification would be done through API calls in actual implementation
  });
});
```

### Performance Testing
```typescript
// Load testing configuration
import { check } from 'k6';
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate under 1%
  },
};

export default function () {
  // Test widget API endpoint
  let response = http.post('https://api.carbot.ai/v1/widget/chat', {
    client_key: 'cb_prod_test_key_for_load_testing',
    session_id: `session_${__VU}_${__ITER}`,
    message: 'Test message for load testing',
  }, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'response has message': (r) => JSON.parse(r.body).response.length > 0,
  });
}
```

---

This comprehensive technical requirements document provides the development team with detailed specifications for implementing the CarBot MVP with client keys, landing pages, and template selection functionality. Each section includes practical implementation details, code examples, and quality assurance measures to ensure 100% implementation success.