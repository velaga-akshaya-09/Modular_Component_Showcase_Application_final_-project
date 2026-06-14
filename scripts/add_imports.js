const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend', 'src', 'pages');

const mapping = {
  'Dashboard.jsx': 'Dashboard.css',
  'ComponentDetails.jsx': 'ComponentDetails.css',
  'ViewComponents.jsx': 'ViewComponents.css',
  'Login.jsx': 'Auth.css',
  'Signup.jsx': 'Auth.css',
  'AdminUsers.jsx': 'Admin.css',
  'Categories.jsx': 'Admin.css',
  'Favorites.jsx': 'Favorites.css',
  'SearchComponents.jsx': 'SearchComponents.css'
};

for (const [file, cssFile] of Object.entries(mapping)) {
  const filePath = path.join(pagesDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const importStatement = `import "../styles/pages/${cssFile}";\n`;
    if (!content.includes(importStatement)) {
      // Find the last import statement or the beginning of the file
      const importRegex = /^import\s+.*?(?:from\s+['"].*?['"]|['"].*?['"])\s*;/gm;
      let lastMatch = null;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        lastMatch = match;
      }
      
      if (lastMatch) {
        const insertPos = lastMatch.index + lastMatch[0].length + 1;
        content = content.slice(0, insertPos) + importStatement + content.slice(insertPos);
      } else {
        content = importStatement + content;
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`Added import to ${file}`);
    }
  }
}
