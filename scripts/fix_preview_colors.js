const fs = require('fs');

const appendCss = `
/* MASTER OVERRIDE FOR COMPONENT PREVIEW READABILITY */
.detail-meta-box code, .component-preview-box code {
  background: rgba(255, 255, 255, 0.5) !important;
  color: #454a34 !important;
  border: 1px solid rgba(69, 74, 52, 0.3) !important;
}

.breadcrumbs-nav {
  background: rgba(255, 255, 255, 0.3) !important;
  border-color: rgba(69, 74, 52, 0.2) !important;
  color: #454a34 !important;
}

.breadcrumbs-nav *, .breadcrumb-node *, .breadcrumb-current {
  color: #454a34 !important;
}

.status-badge-clearance, .clearance-level-badge, .req-yes, .trend-up, .type-deploy, .type-infra {
  background: rgba(69, 74, 52, 0.15) !important;
  color: #454a34 !important;
  border-color: rgba(69, 74, 52, 0.3) !important;
}
`;

function processFile(file) {
  if (fs.existsSync(file)) {
    let css = fs.readFileSync(file, 'utf8');
    css += appendCss;
    fs.writeFileSync(file, css);
    console.log('Updated ' + file);
  }
}

processFile('frontend/src/styles/global.css');
processFile('frontend/src/App.css');
