const fs = require('fs');

function processFile(file) {
  if (fs.existsSync(file)) {
    let js = fs.readFileSync(file, 'utf8');
    
    // Replace 1: Import useLocation
    js = js.replace(
      'import { Link } from "react-router-dom";', 
      'import { Link, useLocation } from "react-router-dom";'
    );
    
    // Replace 2: Add location parsing logic to selectedCategory
    const searchString = `function ViewComponents({ onToast }) {
  const [components, setComponents] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");`;
  
    const replacementString = `function ViewComponents({ onToast }) {
  const location = useLocation();
  const [components, setComponents] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "All";
  });`;

    js = js.replace(searchString, replacementString);

    fs.writeFileSync(file, js);
    console.log('Updated ' + file);
  }
}

processFile('frontend/src/pages/ViewComponents.jsx');
