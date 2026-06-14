const fs = require('fs');

const appendCss = `
/* MASTER OVERRIDE FOR DATA LISTS */
.activity-panel dt, .component-meta-list dt, .detail-meta-list dt {
  color: #000000 !important;
  font-weight: 900 !important;
}

.activity-panel dd, .component-meta-list dd, .detail-meta-list dd {
  color: #454a34 !important;
  font-weight: 600 !important;
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
