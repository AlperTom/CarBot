#!/usr/bin/env node

/**
 * GitHub Issues Creation Script for CarBot
 * Automatically creates all 35 enhancement issues on GitHub
 */

const fs = require('fs');
const path = require('path');

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'YOUR_GITHUB_TOKEN_HERE';
const REPO_OWNER = 'AlperTom';
const REPO_NAME = 'CarBot';
const BASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

// GitHub API Headers
const headers = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
};

// Issue categories with labels and priorities
const issueCategories = {
  'performance': { label: 'performance', priority: 'high', phase: 1 },
  'features': { label: 'enhancement', priority: 'medium', phase: 2 },
  'security': { label: 'security', priority: 'high', phase: 1 },
  'ux': { label: 'ux', priority: 'medium', phase: 2 },
  'infrastructure': { label: 'infrastructure', priority: 'medium', phase: 3 },
  'testing': { label: 'testing', priority: 'medium', phase: 1 }
};

// Create GitHub issue from markdown file
async function createIssueFromMarkdown(filePath, category) {
  try {
    console.log(`📝 Processing: ${filePath}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.md');
    
    // Extract title from first line (remove # and cleanup)
    const lines = content.split('\n');
    const titleLine = lines.find(line => line.startsWith('# ')) || lines[0];
    const title = titleLine.replace(/^#\s*/, '').replace(/🎯\s*Enhancement:\s*/, '').trim();
    
    // Use the full markdown content as body
    const body = content;
    
    // Get category info
    const categoryInfo = issueCategories[category] || { label: 'enhancement', priority: 'medium', phase: 2 };
    
    // Create labels array
    const labels = [
      categoryInfo.label,
      `priority-${categoryInfo.priority}`,
      `phase-${categoryInfo.phase}`,
      'german-market'
    ];
    
    // Add revenue-impact label for high-value issues
    if (content.includes('€50,000') || content.includes('€75,000') || content.includes('€100,000')) {
      labels.push('revenue-impact');
    }
    
    const issueData = {
      title: title,
      body: body,
      labels: labels
    };
    
    console.log(`🚀 Creating issue: "${title}"`);
    
    // Make API request to create issue
    const response = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(issueData)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${error}`);
    }
    
    const result = await response.json();
    console.log(`✅ Created issue #${result.number}: ${title}`);
    return result;
    
  } catch (error) {
    console.error(`❌ Error creating issue from ${filePath}:`, error.message);
    return null;
  }
}

// Create all issues from directory structure
async function createAllIssues() {
  console.log('🚀 Starting GitHub Issues Creation for CarBot');
  console.log('=====================================');
  
  if (GITHUB_TOKEN === 'YOUR_GITHUB_TOKEN_HERE') {
    console.error('❌ Please set your GITHUB_TOKEN environment variable or update the script');
    console.log('💡 Get your token from: https://github.com/settings/tokens');
    process.exit(1);
  }
  
  const issuesDir = './github-issues';
  const createdIssues = [];
  
  // Process each category
  for (const [category, info] of Object.entries(issueCategories)) {
    console.log(`\n📁 Processing ${category} issues (Phase ${info.phase})...`);
    
    const categoryDir = path.join(issuesDir, category);
    
    if (!fs.existsSync(categoryDir)) {
      console.log(`⚠️ Directory not found: ${categoryDir}`);
      continue;
    }
    
    const files = fs.readdirSync(categoryDir)
      .filter(file => file.endsWith('.md'))
      .sort();
    
    console.log(`📋 Found ${files.length} issues in ${category}/`);
    
    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      const issue = await createIssueFromMarkdown(filePath, category);
      
      if (issue) {
        createdIssues.push({
          number: issue.number,
          title: issue.title,
          category: category,
          url: issue.html_url
        });
      }
      
      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Summary
  console.log('\n🎉 GitHub Issues Creation Complete!');
  console.log('=====================================');
  console.log(`✅ Total issues created: ${createdIssues.length}`);
  console.log(`🔗 Repository: https://github.com/${REPO_OWNER}/${REPO_NAME}/issues`);
  
  // Group by category for summary
  const summary = {};
  createdIssues.forEach(issue => {
    if (!summary[issue.category]) summary[issue.category] = [];
    summary[issue.category].push(issue);
  });
  
  console.log('\n📊 Issues by Category:');
  Object.entries(summary).forEach(([category, issues]) => {
    console.log(`  ${category}: ${issues.length} issues`);
    issues.forEach(issue => {
      console.log(`    #${issue.number}: ${issue.title}`);
    });
  });
  
  // Create milestone recommendations
  console.log('\n🎯 Next Steps:');
  console.log('1. Visit your repository to review the created issues');
  console.log('2. Create milestones for the 4 development phases');
  console.log('3. Assign issues to appropriate milestones');
  console.log('4. Start with Phase 1 (Performance & Security) issues');
  
  return createdIssues;
}

// Create GitHub labels if they don't exist
async function createLabels() {
  console.log('🏷️ Creating GitHub labels...');
  
  const labels = [
    { name: 'performance', color: 'ff4444', description: 'Performance optimization and speed improvements' },
    { name: 'enhancement', color: '0052cc', description: 'New features and improvements' },
    { name: 'security', color: 'ff8800', description: 'Security improvements and fixes' },
    { name: 'ux', color: '8b5cf6', description: 'User experience and interface improvements' },
    { name: 'infrastructure', color: '6b7280', description: 'Infrastructure and deployment improvements' },
    { name: 'testing', color: '10b981', description: 'Testing and quality assurance' },
    { name: 'priority-high', color: 'd73a49', description: 'High priority issues' },
    { name: 'priority-medium', color: 'fbca04', description: 'Medium priority issues' },
    { name: 'priority-low', color: '0e8a16', description: 'Low priority issues' },
    { name: 'phase-1', color: 'b60205', description: 'Phase 1 - Performance & Security' },
    { name: 'phase-2', color: 'fbca04', description: 'Phase 2 - Features & UX' },
    { name: 'phase-3', color: '0052cc', description: 'Phase 3 - Infrastructure & Scale' },
    { name: 'phase-4', color: '0e8a16', description: 'Phase 4 - Advanced Features' },
    { name: 'german-market', color: '000000', description: 'German automotive market specific' },
    { name: 'revenue-impact', color: 'd4a72c', description: 'High revenue impact features' }
  ];
  
  for (const label of labels) {
    try {
      const response = await fetch(`${BASE_URL}/labels`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(label)
      });
      
      if (response.status === 201) {
        console.log(`✅ Created label: ${label.name}`);
      } else if (response.status === 422) {
        console.log(`ℹ️ Label already exists: ${label.name}`);
      } else {
        console.log(`⚠️ Error creating label ${label.name}: ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Error creating label ${label.name}:`, error.message);
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Main execution
async function main() {
  try {
    // First create labels
    await createLabels();
    console.log('');
    
    // Then create all issues
    await createAllIssues();
    
  } catch (error) {
    console.error('❌ Script execution failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createAllIssues, createLabels };