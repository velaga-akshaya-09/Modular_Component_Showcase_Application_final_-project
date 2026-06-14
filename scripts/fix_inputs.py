import os

append_css = """
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
"""

files = ['frontend/src/styles/global.css', 'frontend/src/App.css']

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            css = file.read()
        
        # We can just safely append it, since the CSS cascades and !important at the very end wins everything
        css += append_css
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(css)
        print(f"Updated {f}")
