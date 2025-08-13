#!/usr/bin/env node
/**
 * Bundle Size Analysis Tool for CarBot
 * Analyzes JavaScript and CSS bundle sizes and provides optimization recommendations
 */

const fs = require('fs').promises;
const path = require('path');
const { gzipSync } = require('zlib');

// Configuration
const CONFIG = {
  buildDir: path.join(__dirname, '..', '.next'),
  publicDir: path.join(__dirname, '..', 'public'),
  outputFile: path.join(__dirname, '..', 'bundle-analysis.json'),
  thresholds: {
    js: {
      warning: 400 * 1024,   // 400KB
      error: 600 * 1024     // 600KB
    },
    css: {
      warning: 80 * 1024,    // 80KB  
      error: 120 * 1024     // 120KB
    },
    image: {
      warning: 200 * 1024,   // 200KB per image
      error: 500 * 1024     // 500KB per image
    }
  }
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m', 
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getStatusColor(size, thresholds) {
  if (size >= thresholds.error) return 'red';
  if (size >= thresholds.warning) return 'yellow';  
  return 'green';
}

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

async function getGzipSize(content) {
  try {
    const compressed = gzipSync(content);
    return compressed.length;
  } catch (error) {
    return 0;
  }
}

async function analyzeJavaScriptBundles() {
  log('\n📦 Analyzing JavaScript Bundles...', 'cyan');
  
  const staticDir = path.join(CONFIG.buildDir, 'static');
  const chunksDir = path.join(staticDir, 'chunks');
  
  const bundles = [];
  let totalSize = 0;
  let totalGzipSize = 0;
  
  try {
    // Check if build directory exists
    try {
      await fs.access(CONFIG.buildDir);
    } catch (error) {
      log('⚠️  Build directory not found. Run `npm run build` first.', 'yellow');
      return { bundles: [], totalSize: 0, totalGzipSize: 0 };
    }
    
    // Analyze chunks
    try {
      const chunkFiles = await fs.readdir(chunksDir);
      
      for (const file of chunkFiles) {
        if (file.endsWith('.js')) {
          const filePath = path.join(chunksDir, file);
          const size = await getFileSize(filePath);
          const content = await fs.readFile(filePath);
          const gzipSize = await getGzipSize(content);
          
          totalSize += size;
          totalGzipSize += gzipSize;
          
          // Categorize bundles
          let category = 'other';
          if (file.includes('framework')) category = 'framework';
          else if (file.includes('main')) category = 'main';
          else if (file.includes('webpack')) category = 'webpack';
          else if (file.includes('vendor')) category = 'vendor';
          else if (file.match(/^[0-9a-f]+/)) category = 'page';
          
          const bundle = {
            file,
            path: filePath,
            size,
            gzipSize,
            sizeFormatted: formatBytes(size),
            gzipSizeFormatted: formatBytes(gzipSize),
            category
          };
          
          bundles.push(bundle);
          
          const color = getStatusColor(size, CONFIG.thresholds.js);
          log(`  ${file}: ${formatBytes(size)} (${formatBytes(gzipSize)} gzipped)`, color);
        }
      }
    } catch (error) {
      log(`⚠️  Could not analyze chunks directory: ${error.message}`, 'yellow');
    }
    
    // Analyze pages
    try {
      const pagesDir = path.join(staticDir, 'chunks', 'pages');
      const pageFiles = await fs.readdir(pagesDir);
      
      for (const file of pageFiles) {
        if (file.endsWith('.js')) {
          const filePath = path.join(pagesDir, file);
          const size = await getFileSize(filePath);
          const content = await fs.readFile(filePath);
          const gzipSize = await getGzipSize(content);
          
          totalSize += size;
          totalGzipSize += gzipSize;
          
          const bundle = {
            file: `pages/${file}`,
            path: filePath,
            size,
            gzipSize,
            sizeFormatted: formatBytes(size),
            gzipSizeFormatted: formatBytes(gzipSize),
            category: 'page'
          };
          
          bundles.push(bundle);
          
          const color = getStatusColor(size, CONFIG.thresholds.js);
          log(`  pages/${file}: ${formatBytes(size)} (${formatBytes(gzipSize)} gzipped)`, color);
        }
      }
    } catch (error) {
      // Pages directory might not exist in all Next.js versions
    }
    
  } catch (error) {
    log(`❌ Error analyzing JavaScript bundles: ${error.message}`, 'red');
  }
  
  // Sort bundles by size
  bundles.sort((a, b) => b.size - a.size);
  
  log(`\n📊 Total JavaScript: ${formatBytes(totalSize)} (${formatBytes(totalGzipSize)} gzipped)`, 
      getStatusColor(totalSize, CONFIG.thresholds.js));
  
  return { bundles, totalSize, totalGzipSize };
}

async function analyzeCSSBundles() {
  log('\n🎨 Analyzing CSS Bundles...', 'cyan');
  
  const staticDir = path.join(CONFIG.buildDir, 'static');
  const cssDir = path.join(staticDir, 'css');
  
  const bundles = [];
  let totalSize = 0;
  let totalGzipSize = 0;
  
  try {
    const cssFiles = await fs.readdir(cssDir);
    
    for (const file of cssFiles) {
      if (file.endsWith('.css')) {
        const filePath = path.join(cssDir, file);
        const size = await getFileSize(filePath);
        const content = await fs.readFile(filePath);
        const gzipSize = await getGzipSize(content);
        
        totalSize += size;
        totalGzipSize += gzipSize;
        
        const bundle = {
          file,
          path: filePath,
          size,
          gzipSize,
          sizeFormatted: formatBytes(size),
          gzipSizeFormatted: formatBytes(gzipSize),
          category: file.includes('app') ? 'app' : 'chunk'
        };
        
        bundles.push(bundle);
        
        const color = getStatusColor(size, CONFIG.thresholds.css);
        log(`  ${file}: ${formatBytes(size)} (${formatBytes(gzipSize)} gzipped)`, color);
      }
    }
  } catch (error) {
    log(`⚠️  CSS directory not found or empty`, 'yellow');
  }
  
  // Also check for global CSS
  const globalCSSPath = path.join(__dirname, '..', 'app', 'globals.css');
  try {
    const size = await getFileSize(globalCSSPath);
    if (size > 0) {
      const content = await fs.readFile(globalCSSPath);
      const gzipSize = await getGzipSize(content);
      
      const bundle = {
        file: 'globals.css',
        path: globalCSSPath,
        size,
        gzipSize,
        sizeFormatted: formatBytes(size),
        gzipSizeFormatted: formatBytes(gzipSize),
        category: 'global'
      };
      
      bundles.push(bundle);
      
      const color = getStatusColor(size, CONFIG.thresholds.css);
      log(`  globals.css: ${formatBytes(size)} (${formatBytes(gzipSize)} gzipped)`, color);
    }
  } catch (error) {
    // Global CSS file might not exist
  }
  
  bundles.sort((a, b) => b.size - a.size);
  
  log(`\n📊 Total CSS: ${formatBytes(totalSize)} (${formatBytes(totalGzipSize)} gzipped)`, 
      getStatusColor(totalSize, CONFIG.thresholds.css));
  
  return { bundles, totalSize, totalGzipSize };
}

async function analyzeImages() {
  log('\n🖼️  Analyzing Images...', 'cyan');
  
  const images = [];
  let totalSize = 0;
  
  async function analyzeDirectory(dirPath, relativePath = '') {
    try {
      const files = await fs.readdir(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isDirectory()) {
          await analyzeDirectory(filePath, path.join(relativePath, file));
        } else if (/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(file)) {
          const size = stats.size;
          totalSize += size;
          
          const image = {
            file: path.join(relativePath, file),
            path: filePath,
            size,
            sizeFormatted: formatBytes(size)
          };
          
          images.push(image);
          
          const color = getStatusColor(size, CONFIG.thresholds.image);
          log(`  ${image.file}: ${formatBytes(size)}`, color);
        }
      }
    } catch (error) {
      // Directory might not exist
    }
  }
  
  await analyzeDirectory(CONFIG.publicDir);
  
  // Also check _next/static if it exists
  const nextStaticDir = path.join(CONFIG.buildDir, 'static');
  await analyzeDirectory(nextStaticDir, '_next/static');
  
  images.sort((a, b) => b.size - a.size);
  
  log(`\n📊 Total Images: ${formatBytes(totalSize)}`, 
      getStatusColor(totalSize, CONFIG.thresholds.image.error * 10)); // More lenient for total
  
  return { images, totalSize };
}

async function generateRecommendations(analysis) {
  const recommendations = [];
  
  // JavaScript recommendations
  if (analysis.javascript.totalSize > CONFIG.thresholds.js.warning) {
    recommendations.push({
      category: 'JavaScript',
      priority: analysis.javascript.totalSize > CONFIG.thresholds.js.error ? 'High' : 'Medium',
      issue: 'Large JavaScript bundle size',
      description: 'Consider code splitting and lazy loading to reduce initial bundle size',
      impact: `Current size: ${formatBytes(analysis.javascript.totalSize)}`,
      solutions: [
        'Implement dynamic imports for non-critical components',
        'Use Next.js automatic code splitting',
        'Remove unused dependencies',
        'Enable tree shaking optimization'
      ]
    });
  }
  
  // CSS recommendations  
  if (analysis.css.totalSize > CONFIG.thresholds.css.warning) {
    recommendations.push({
      category: 'CSS',
      priority: analysis.css.totalSize > CONFIG.thresholds.css.error ? 'High' : 'Medium',
      issue: 'Large CSS bundle size',
      description: 'CSS bundle size could be optimized for better performance',
      impact: `Current size: ${formatBytes(analysis.css.totalSize)}`,
      solutions: [
        'Remove unused CSS with PurgeCSS',
        'Split critical and non-critical CSS',
        'Use CSS modules for better tree shaking',
        'Optimize Tailwind CSS configuration'
      ]
    });
  }
  
  // Large individual bundles
  const largeBundles = analysis.javascript.bundles.filter(bundle => 
    bundle.size > CONFIG.thresholds.js.warning / 2
  );
  
  if (largeBundles.length > 0) {
    recommendations.push({
      category: 'Code Splitting',
      priority: 'Medium',
      issue: 'Large individual bundles detected',
      description: 'Some bundles are large and could benefit from further splitting',
      impact: `Largest bundle: ${largeBundles[0].file} (${largeBundles[0].sizeFormatted})`,
      solutions: [
        'Split large components into smaller chunks',
        'Use React.lazy() for component-level splitting',
        'Implement route-based code splitting',
        'Consider vendor chunk optimization'
      ]
    });
  }
  
  // Image optimization
  const largeImages = analysis.images.images.filter(image => 
    image.size > CONFIG.thresholds.image.warning
  );
  
  if (largeImages.length > 0) {
    recommendations.push({
      category: 'Images',
      priority: 'Medium',
      issue: 'Large images detected',
      description: 'Some images are large and could be optimized',
      impact: `${largeImages.length} images over ${formatBytes(CONFIG.thresholds.image.warning)}`,
      solutions: [
        'Convert to WebP format with fallbacks',
        'Implement responsive images with srcset',
        'Use Next.js Image component for optimization',
        'Compress images before deployment'
      ]
    });
  }
  
  // Performance recommendations
  const totalBundleSize = analysis.javascript.totalSize + analysis.css.totalSize;
  if (totalBundleSize > 500 * 1024) { // 500KB total
    recommendations.push({
      category: 'Performance',
      priority: 'High',
      issue: 'Total bundle size impact on mobile',
      description: 'Large total bundle size affects mobile performance',
      impact: `Total bundles: ${formatBytes(totalBundleSize)}`,
      solutions: [
        'Implement service worker caching',
        'Use preload/prefetch for critical resources',
        'Enable compression (gzip/brotli) on server',
        'Consider progressive loading strategies'
      ]
    });
  }
  
  return recommendations;
}

async function generateReport(analysis) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      javascript: {
        totalSize: analysis.javascript.totalSize,
        totalSizeFormatted: formatBytes(analysis.javascript.totalSize),
        gzipSize: analysis.javascript.totalGzipSize,
        gzipSizeFormatted: formatBytes(analysis.javascript.totalGzipSize),
        bundleCount: analysis.javascript.bundles.length,
        status: getStatusColor(analysis.javascript.totalSize, CONFIG.thresholds.js)
      },
      css: {
        totalSize: analysis.css.totalSize,
        totalSizeFormatted: formatBytes(analysis.css.totalSize),
        gzipSize: analysis.css.totalGzipSize,
        gzipSizeFormatted: formatBytes(analysis.css.totalGzipSize),
        bundleCount: analysis.css.bundles.length,
        status: getStatusColor(analysis.css.totalSize, CONFIG.thresholds.css)
      },
      images: {
        totalSize: analysis.images.totalSize,
        totalSizeFormatted: formatBytes(analysis.images.totalSize),
        imageCount: analysis.images.images.length,
        status: getStatusColor(analysis.images.totalSize, CONFIG.thresholds.image.error * 10)
      },
      total: {
        size: analysis.javascript.totalSize + analysis.css.totalSize + analysis.images.totalSize,
        sizeFormatted: formatBytes(analysis.javascript.totalSize + analysis.css.totalSize + analysis.images.totalSize)
      }
    },
    details: {
      javascript: analysis.javascript,
      css: analysis.css,
      images: analysis.images
    },
    recommendations: analysis.recommendations,
    thresholds: CONFIG.thresholds
  };
  
  // Save to file
  await fs.writeFile(CONFIG.outputFile, JSON.stringify(report, null, 2));
  
  return report;
}

function printSummary(report) {
  log('\n📊 Bundle Analysis Summary', 'bright');
  log('═'.repeat(50), 'cyan');
  
  log(`\n📦 JavaScript Bundles:`, 'blue');
  log(`  Total: ${report.summary.javascript.totalSizeFormatted} (${report.summary.javascript.gzipSizeFormatted} gzipped)`, 
      report.summary.javascript.status);
  log(`  Files: ${report.summary.javascript.bundleCount}`, 'dim');
  
  log(`\n🎨 CSS Bundles:`, 'blue');
  log(`  Total: ${report.summary.css.totalSizeFormatted} (${report.summary.css.gzipSizeFormatted} gzipped)`, 
      report.summary.css.status);
  log(`  Files: ${report.summary.css.bundleCount}`, 'dim');
  
  log(`\n🖼️  Images:`, 'blue');
  log(`  Total: ${report.summary.images.totalSizeFormatted}`, report.summary.images.status);
  log(`  Files: ${report.summary.images.imageCount}`, 'dim');
  
  log(`\n📊 Overall Total: ${report.summary.total.sizeFormatted}`, 'bright');
  
  if (report.recommendations.length > 0) {
    log('\n💡 Top Recommendations:', 'yellow');
    report.recommendations.slice(0, 3).forEach((rec, index) => {
      const priority = rec.priority === 'High' ? 'red' : rec.priority === 'Medium' ? 'yellow' : 'green';
      log(`  ${index + 1}. [${rec.priority}] ${rec.issue}`, priority);
      log(`     ${rec.description}`, 'dim');
    });
  }
  
  log(`\n📄 Detailed report saved to: ${CONFIG.outputFile}`, 'cyan');
}

async function main() {
  log('🔍 CarBot Bundle Size Analysis', 'bright');
  log('═'.repeat(50), 'cyan');
  
  try {
    const analysis = {
      javascript: await analyzeJavaScriptBundles(),
      css: await analyzeCSSBundles(),
      images: await analyzeImages()
    };
    
    analysis.recommendations = await generateRecommendations(analysis);
    
    const report = await generateReport(analysis);
    
    printSummary(report);
    
    log('\n✅ Bundle analysis complete!', 'green');
    
  } catch (error) {
    log(`❌ Analysis failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, analyzeJavaScriptBundles, analyzeCSSBundles, analyzeImages };