const fs = require('fs');

const appendCss = `
/* MASTER OVERRIDE FOR RATING STARS */
.rating-row button, .rating-row .rating-active {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  min-width: 24px !important;
  min-height: 28px !important;
}

.rating-row button {
  color: #a8a08d !important; /* Muted olive for inactive stars */
}

.rating-row button:hover, .rating-row .rating-active {
  color: #454a34 !important; /* Solid dark olive for active stars */
  transform: scale(1.15) !important;
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
