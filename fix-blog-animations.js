// Quick script to help identify blog card pattern for animations
const fs = require('fs');

const filePath = 'C:\\Users\\Alper\\OneDrive\\Desktop\\Projects\\CarBot\\app\\page.jsx';
const content = fs.readFileSync(filePath, 'utf8');

// Find all blog link patterns
const blogLinks = content.match(/<Link href="\/blog\/[^"]+"/g);
console.log('Found blog links:', blogLinks?.length || 0);

if (blogLinks) {
  blogLinks.forEach((link, index) => {
    console.log(`${index + 1}: ${link} - Delay: ${0.4 + (index * 0.2)}s`);
  });
}