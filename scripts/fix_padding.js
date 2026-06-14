const fs = require('fs');

const appendCss = `
/* MASTER OVERRIDE FOR SEARCH INPUT PADDING */
.search-input-wrap input {
  padding-left: 48px !important;
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
