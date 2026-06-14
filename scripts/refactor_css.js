const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend', 'src');
const pagesDir = path.join(frontendDir, 'styles', 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

const premiumCss = fs.readFileSync(path.join(frontendDir, 'premium.css'), 'utf8');

// Extract global variables
const rootMatch = premiumCss.match(/:root\s*\{[\s\S]*?\n\}/);
const globalVars = rootMatch ? rootMatch[0] : '';

const dashboardKeywords = ['.console-stage', '.console-window', '.console-main', '.role-hero', '.stat-card', '.console-panel', '.queue-table', '.queue-row', '.chart-panel', '.activity-panel', '.add-panel', '.detail-meta-panel', '.bar-item', '.clearance-level-badge', '.status-badge-clearance'];
const authKeywords = ['.auth-card', '.auth-form', '.input-group', '.auth-options', '.auth-footer'];
const componentDetailsKeywords = ['.preview-split-stage', '.component-preview-box', '.preview-pane-left', '.preview-theme-dark', '.code-preview-pane', '.code-stage', '.pane-header-mini', '.tab-btn.active', '.icon-button.active-favorite', 'pre[class', 'code[class'];
const viewComponentsKeywords = ['.component-card', '.registry-row', '.semantic-result-card'];

let dashboardCss = '/* Dashboard specific styles */\n\n';
let authCss = '/* Auth (Login/Signup) specific styles */\n\n';
let componentDetailsCss = '/* Component Details specific styles */\n\n';
let viewComponentsCss = '/* View Components specific styles */\n\n';
let globalOverrides = '/* Global Overrides */\n\n';

const rules = [...premiumCss.matchAll(/([^{]+)\{([^}]+)\}/g)];

for (const match of rules) {
  const selector = match[1].trim();
  const body = match[2];
  
  if (selector === ':root' || selector.startsWith('@import')) continue;
  
  const rule = `${selector} {${body}}\n\n`;
  
  if (authKeywords.some(k => selector.includes(k))) {
    authCss += rule;
  } else if (dashboardKeywords.some(k => selector.includes(k))) {
    dashboardCss += rule;
  } else if (componentDetailsKeywords.some(k => selector.includes(k))) {
    componentDetailsCss += rule;
  } else if (viewComponentsKeywords.some(k => selector.includes(k))) {
    viewComponentsCss += rule;
  } else {
    globalOverrides += rule;
  }
}

fs.writeFileSync(path.join(pagesDir, 'Dashboard.css'), dashboardCss);
fs.writeFileSync(path.join(pagesDir, 'Auth.css'), authCss);
fs.writeFileSync(path.join(pagesDir, 'ComponentDetails.css'), componentDetailsCss);
fs.writeFileSync(path.join(pagesDir, 'ViewComponents.css'), viewComponentsCss);
fs.writeFileSync(path.join(pagesDir, 'Admin.css'), '/* Admin styles */\n');
fs.writeFileSync(path.join(pagesDir, 'Favorites.css'), '/* Favorites styles */\n');
fs.writeFileSync(path.join(pagesDir, 'SearchComponents.css'), '/* Search styles */\n');

let appCss = fs.readFileSync(path.join(frontendDir, 'App.css'), 'utf8');
appCss = appCss.replace(/:root(\[data-theme="light"\])?\s*\{[\s\S]*?\n\}/g, '');

const finalGlobalCss = `${globalVars}\n\n${appCss}\n\n${globalOverrides}`;
fs.writeFileSync(path.join(frontendDir, 'styles', 'global.css'), finalGlobalCss);

console.log('CSS files distributed successfully.');
