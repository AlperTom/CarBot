/**
 * Comprehensive Mobile & Performance Testing Suite for CarBot
 * Tests mobile experience, Core Web Vitals, PWA functionality, and cross-device compatibility
 */

const { test, expect, devices } = require('@playwright/test');

// Mobile device configurations
const MOBILE_DEVICES = {
  'iPhone 13': devices['iPhone 13'],
  'iPhone 13 Pro': devices['iPhone 13 Pro'],
  'iPhone SE': devices['iPhone SE'],
  'Pixel 7': devices['Pixel 7'],
  'Galaxy S22': devices['Galaxy S22'],
  'iPad': devices['iPad'],
  'Galaxy Tab S4': devices['Galaxy Tab S4']
};

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift
  TTFB: 600, // Time to First Byte (ms)
  FCP: 1800, // First Contentful Paint (ms)
  SI: 3400,  // Speed Index
  TBT: 200   // Total Blocking Time (ms)
};

// Network conditions
const NETWORK_CONDITIONS = {
  '3G': { downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8, latency: 150 },
  '4G': { downloadThroughput: 9 * 1024 * 1024 / 8, uploadThroughput: 9 * 1024 * 1024 / 8, latency: 60 },
  'Slow3G': { downloadThroughput: 500 * 1024 / 8, uploadThroughput: 500 * 1024 / 8, latency: 400 }
};

// Core Web Vitals measurement function
async function measureCoreWebVitals(page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals = {};
      
      // LCP (Largest Contentful Paint)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.LCP = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay) - can't be measured without user interaction
      vitals.FID = 0;

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        vitals.CLS = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });

      // Additional metrics
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        vitals.TTFB = navigation.responseStart - navigation.requestStart;
        vitals.FCP = navigation.loadEventStart - navigation.navigationStart;
        vitals.loadTime = navigation.loadEventEnd - navigation.navigationStart;
        vitals.domComplete = navigation.domComplete - navigation.navigationStart;
      }

      // Wait for LCP to be measured
      setTimeout(() => resolve(vitals), 3000);
    });
  });
}

// Test suite for each mobile device
Object.entries(MOBILE_DEVICES).forEach(([deviceName, deviceConfig]) => {
  test.describe(`Mobile Performance: ${deviceName}`, () => {
    test.use({ ...deviceConfig });
    
    test.beforeEach(async ({ page, context }) => {
      // Enable geolocation for mobile testing
      await context.grantPermissions(['geolocation']);
      await context.setGeolocation({ latitude: 52.520008, longitude: 13.404954 });
    });

    test('Homepage loads and performs well on mobile', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Measure Core Web Vitals
      const vitals = await measureCoreWebVitals(page);
      
      // Performance assertions
      expect(vitals.LCP).toBeLessThan(PERFORMANCE_THRESHOLDS.LCP);
      expect(vitals.CLS).toBeLessThan(PERFORMANCE_THRESHOLDS.CLS);
      expect(vitals.TTFB).toBeLessThan(PERFORMANCE_THRESHOLDS.TTFB);
      
      // Visual verification
      await expect(page).toHaveScreenshot(`homepage-${deviceName.toLowerCase().replace(/\s+/g, '-')}.png`);
      
      console.log(`📱 ${deviceName} Performance:`, {
        LCP: `${vitals.LCP}ms`,
        CLS: vitals.CLS.toFixed(3),
        TTFB: `${vitals.TTFB}ms`,
        loadTime: `${Date.now() - startTime}ms`
      });
    });

    test('Mobile navigation functionality', async ({ page }) => {
      await page.goto('/');
      
      // Test mobile menu visibility
      const isMobile = deviceName.includes('iPhone') || deviceName.includes('Pixel') || deviceName.includes('Galaxy S');
      
      if (isMobile) {
        // Desktop nav should be hidden on mobile
        await expect(page.locator('.desktop-nav')).not.toBeVisible();
        
        // Mobile menu button should be visible
        const mobileMenuButton = page.locator('.mobile-nav-button');
        await expect(mobileMenuButton).toBeVisible();
        
        // Test mobile menu interaction
        await mobileMenuButton.click();
        await expect(page.locator('.mobile-nav-items')).toBeVisible();
        
        // Test menu item clicks
        await page.click('a[href="/pricing"]');
        await expect(page).toHaveURL('/pricing');
      } else {
        // Tablet view - desktop nav should be visible
        await expect(page.locator('.desktop-nav')).toBeVisible();
      }
    });

    test('Touch interactions and gesture handling', async ({ page }) => {
      await page.goto('/');
      
      // Test touch targets are at least 44px (iOS recommendation)
      const buttons = page.locator('button, a');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(44);
            expect(box.width).toBeGreaterThanOrEqual(44);
          }
        }
      }
      
      // Test swipe gestures if on mobile
      const isMobile = deviceName.includes('iPhone') || deviceName.includes('Pixel') || deviceName.includes('Galaxy S');
      if (isMobile) {
        // Test horizontal swipe on cards/elements
        const swipeableElements = page.locator('.feature-card, .card-hover');
        if (await swipeableElements.count() > 0) {
          const firstCard = swipeableElements.first();
          const box = await firstCard.boundingBox();
          
          if (box) {
            // Perform swipe gesture
            await page.mouse.move(box.x + box.width - 10, box.y + box.height / 2);
            await page.mouse.down();
            await page.mouse.move(box.x + 10, box.y + box.height / 2);
            await page.mouse.up();
          }
        }
      }
    });

    test('Form input experience on mobile', async ({ page }) => {
      await page.goto('/auth/register');
      
      // Test form inputs are properly sized for mobile
      const inputs = page.locator('input[type="email"], input[type="password"], input[type="text"]');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        
        // Check font-size is at least 16px to prevent zoom on iOS
        const fontSize = await input.evaluate(el => window.getComputedStyle(el).fontSize);
        expect(parseInt(fontSize)).toBeGreaterThanOrEqual(16);
        
        // Test input focus and interaction
        await input.click();
        await expect(input).toBeFocused();
        
        // Test typing
        if (i === 0) {
          await input.fill('test@example.com');
          await expect(input).toHaveValue('test@example.com');
        }
      }
    });

    test('Scroll behavior and smoothness', async ({ page }) => {
      await page.goto('/');
      
      // Test smooth scrolling
      await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'smooth' }));
      await page.waitForTimeout(1000);
      
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(400);
      
      // Test scroll to top
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      await page.waitForTimeout(1000);
      
      const finalScrollY = await page.evaluate(() => window.scrollY);
      expect(finalScrollY).toBeLessThan(100);
    });

    test('Modal and popup mobile behavior', async ({ page }) => {
      await page.goto('/');
      
      // Look for modal triggers
      const modalTriggers = page.locator('[data-modal], .modal-trigger, button:has-text("Demo")');
      if (await modalTriggers.count() > 0) {
        await modalTriggers.first().click();
        
        // Check modal appears and is properly sized
        const modal = page.locator('.modal, [role="dialog"]');
        await expect(modal).toBeVisible();
        
        // On mobile, modal should be full-screen or nearly full-screen
        const isMobile = deviceName.includes('iPhone') || deviceName.includes('Pixel') || deviceName.includes('Galaxy S');
        if (isMobile) {
          const modalBox = await modal.boundingBox();
          const viewport = page.viewportSize();
          
          if (modalBox && viewport) {
            expect(modalBox.width).toBeGreaterThan(viewport.width * 0.8);
          }
        }
        
        // Test closing modal
        const closeButton = modal.locator('button:has-text("Schließen"), button:has-text("Close"), .modal-close, [aria-label="Close"]');
        if (await closeButton.count() > 0) {
          await closeButton.first().click();
          await expect(modal).not.toBeVisible();
        }
      }
    });

    test('Responsive breakpoints validation', async ({ page }) => {
      await page.goto('/');
      
      const viewport = page.viewportSize();
      console.log(`📱 Testing breakpoints for ${deviceName} (${viewport.width}x${viewport.height})`);
      
      // Test specific breakpoint behaviors
      if (viewport.width <= 640) {
        // Mobile breakpoint
        await expect(page.locator('.desktop-nav')).not.toBeVisible();
        await expect(page.locator('.mobile-nav-button')).toBeVisible();
      } else if (viewport.width <= 768) {
        // Tablet breakpoint
        await expect(page.locator('.desktop-nav')).toBeVisible();
      } else {
        // Desktop breakpoint
        await expect(page.locator('.desktop-nav')).toBeVisible();
        await expect(page.locator('.mobile-nav-button')).not.toBeVisible();
      }
      
      // Test grid layouts adapt properly
      const gridElements = page.locator('.grid, .grid-cols-1, .grid-cols-2, .grid-cols-3');
      if (await gridElements.count() > 0) {
        // Grids should stack on mobile
        const firstGrid = gridElements.first();
        const computedStyle = await firstGrid.evaluate(el => {
          const style = window.getComputedStyle(el);
          return {
            display: style.display,
            gridTemplateColumns: style.gridTemplateColumns
          };
        });
        
        console.log(`Grid style for ${deviceName}:`, computedStyle);
      }
    });
  });
});

// Network condition testing
Object.entries(NETWORK_CONDITIONS).forEach(([networkName, networkConfig]) => {
  test.describe(`Network Performance: ${networkName}`, () => {
    test.use({ ...MOBILE_DEVICES['iPhone 13'] });

    test(`Performance under ${networkName} conditions`, async ({ page, context }) => {
      // Simulate network conditions
      await context.route('**/*', async route => {
        const startTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, networkConfig.latency));
        await route.continue();
      });
      
      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      console.log(`🌐 ${networkName} Load Time: ${loadTime}ms`);
      
      // Network-specific thresholds
      const thresholds = {
        '3G': 5000,
        '4G': 3000,
        'Slow3G': 8000
      };
      
      expect(loadTime).toBeLessThan(thresholds[networkName]);
      
      // Ensure critical content is visible
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });
  });
});

// PWA Testing Suite
test.describe('PWA Functionality', () => {
  test.use({ ...MOBILE_DEVICES['iPhone 13'] });

  test('PWA installation capability', async ({ page }) => {
    await page.goto('/');
    
    // Check for PWA manifest
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.json');
    
    // Check manifest content
    const manifestResponse = await page.request.get('/manifest.json');
    expect(manifestResponse.ok()).toBeTruthy();
    
    const manifest = await manifestResponse.json();
    expect(manifest.name).toBeDefined();
    expect(manifest.short_name).toBeDefined();
    expect(manifest.icons).toBeDefined();
    expect(manifest.start_url).toBeDefined();
    expect(manifest.display).toBe('standalone');
  });

  test('Service worker registration and caching', async ({ page }) => {
    await page.goto('/');
    
    // Check service worker registration
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    expect(swRegistered).toBeTruthy();
    
    // Wait for service worker to install
    await page.waitForTimeout(2000);
    
    // Check if service worker is active
    const swActive = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      return registration.active !== null;
    });
    expect(swActive).toBeTruthy();
  });

  test('Offline functionality', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForTimeout(3000); // Wait for caching
    
    // Go offline
    await context.setOffline(true);
    
    // Navigate to cached page
    await page.goto('/pricing');
    
    // Should still show content (cached)
    await expect(page.locator('h1')).toBeVisible();
    
    // Go back online
    await context.setOffline(false);
  });

  test('Push notification capability', async ({ page, context }) => {
    // Grant notification permissions
    await context.grantPermissions(['notifications']);
    
    await page.goto('/');
    
    // Check if notifications are supported
    const notificationSupported = await page.evaluate(() => {
      return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    });
    
    expect(notificationSupported).toBeTruthy();
  });
});

// Accessibility Testing on Mobile
test.describe('Mobile Accessibility', () => {
  test.use({ ...MOBILE_DEVICES['iPhone 13'] });

  test('Touch target sizing compliance', async ({ page }) => {
    await page.goto('/');
    
    // Check all interactive elements meet minimum touch target size
    const interactiveElements = page.locator('button, a, input, select, textarea, [role="button"], [tabindex="0"]');
    const count = await interactiveElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = interactiveElements.nth(i);
      if (await element.isVisible()) {
        const box = await element.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44); // iOS recommendation
          expect(box.width).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('Keyboard navigation on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    let tabCount = 0;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      if (await focused.count() > 0) {
        tabCount++;
        // Ensure focused element is visible
        await expect(focused).toBeVisible();
      }
    }
    
    expect(tabCount).toBeGreaterThan(0);
  });

  test('Screen reader compatibility', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper ARIA labels
    const ariaLabels = page.locator('[aria-label], [aria-labelledby], [role]');
    expect(await ariaLabels.count()).toBeGreaterThan(0);
    
    // Check heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Should have exactly one h1
    
    // Check alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const altText = await img.getAttribute('alt');
      expect(altText).not.toBeNull();
    }
  });
});

// Performance monitoring during user interactions
test.describe('Interactive Performance', () => {
  test.use({ ...MOBILE_DEVICES['iPhone 13'] });

  test('Performance during form interactions', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Start performance monitoring
    await page.evaluate(() => {
      window.performanceMarks = [];
      const observer = new PerformanceObserver((list) => {
        window.performanceMarks.push(...list.getEntries());
      });
      observer.observe({ entryTypes: ['measure', 'mark'] });
    });
    
    // Fill form with performance measurements
    performance.mark('form-start');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[name="workshopName"]', 'Test Workshop');
    
    performance.mark('form-end');
    
    // Measure form interaction time
    const interactionTime = await page.evaluate(() => {
      performance.measure('form-interaction', 'form-start', 'form-end');
      const measure = performance.getEntriesByName('form-interaction')[0];
      return measure.duration;
    });
    
    console.log(`📝 Form interaction time: ${interactionTime}ms`);
    expect(interactionTime).toBeLessThan(500); // Should be responsive
  });

  test('Animation performance', async ({ page }) => {
    await page.goto('/');
    
    // Monitor animation performance
    const animationPerformance = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frameCount = 0;
        let lastTime = performance.now();
        let minFPS = Infinity;
        let maxFPS = 0;
        
        function measureFrame() {
          const currentTime = performance.now();
          const fps = 1000 / (currentTime - lastTime);
          
          minFPS = Math.min(minFPS, fps);
          maxFPS = Math.max(maxFPS, fps);
          frameCount++;
          
          if (frameCount < 60) { // Measure for 1 second at 60fps
            lastTime = currentTime;
            requestAnimationFrame(measureFrame);
          } else {
            resolve({ minFPS, maxFPS, avgFPS: frameCount / ((currentTime - performance.now() + 1000) / 1000) });
          }
        }
        
        requestAnimationFrame(measureFrame);
      });
    });
    
    console.log(`🎨 Animation Performance:`, animationPerformance);
    expect(animationPerformance.minFPS).toBeGreaterThan(30); // Minimum acceptable FPS
  });
});

// Generate performance report
test.afterAll(async () => {
  console.log('\n🏁 Mobile & Performance Testing Complete!');
  console.log('📊 Performance Summary:');
  console.log(`- LCP Threshold: ${PERFORMANCE_THRESHOLDS.LCP}ms`);
  console.log(`- FID Threshold: ${PERFORMANCE_THRESHOLDS.FID}ms`);
  console.log(`- CLS Threshold: ${PERFORMANCE_THRESHOLDS.CLS}`);
  console.log('📱 Tested Devices:', Object.keys(MOBILE_DEVICES).join(', '));
  console.log('🌐 Tested Networks:', Object.keys(NETWORK_CONDITIONS).join(', '));
});