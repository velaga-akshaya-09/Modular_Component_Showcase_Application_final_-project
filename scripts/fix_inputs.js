const fs = require('fs');

const appendCss = `
/* MASTER OVERRIDE FOR INPUTS */
input, textarea, select, .search-input-wrap input, .console-panel input, .console-panel select, .console-panel textarea, .form-group input, .toolbar-search-input input {
  background: transparent !important;
  border: 1.5px solid #636b4b !important;
  box-shadow: none !important;
  color: #454a34 !important;
  outline: none !important;
}

input:focus, textarea:focus, select:focus, .search-input-wrap:focus-within input {
  border-color: #454a34 !important;
  box-shadow: 0 0 0 3px rgba(69, 74, 52, 0.15) !important;
  background: transparent !important;
}
`;

function processFile(file) {
  if (fs.existsSync(file)) {
    let css = fs.readFileSync(file, 'utf8');
    css = css.replace(/input,\s*textarea,\s*select,\s*pre\s*\{\s*background:\s*#d6d3c4\s*!important;[^}]*\}/g, '');
    css += appendCss;
    fs.writeFileSync(file, css);
    console.log('Updated ' + file);
  }
}

processFile('frontend/src/styles/global.css');
processFile('frontend/src/App.css');
