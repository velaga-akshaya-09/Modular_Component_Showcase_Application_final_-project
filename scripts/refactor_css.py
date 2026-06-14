import os
import re

frontend_dir = "frontend/src"
pages_dir = os.path.join(frontend_dir, "styles", "pages")
os.makedirs(pages_dir, exist_ok=True)

with open(os.path.join(frontend_dir, "premium.css"), "r") as f:
    premium_css = f.read()

# Base global CSS
global_vars = re.search(r':root\s*\{.*?\n\}', premium_css, re.DOTALL)
global_vars_str = global_vars.group(0) if global_vars else ""

# Categorize classes
dashboard_keywords = [".console-stage", ".console-window", ".console-main", ".role-hero", ".stat-card", ".console-panel", ".queue-table", ".queue-row", ".chart-panel", ".activity-panel", ".add-panel", ".detail-meta-panel", ".bar-item", ".clearance-level-badge", ".status-badge-clearance"]
auth_keywords = [".auth-card", ".auth-form", ".input-group", ".auth-options", ".auth-footer"]
component_details_keywords = [".preview-split-stage", ".component-preview-box", ".preview-pane-left", ".preview-theme-dark", ".code-preview-pane", ".code-stage", ".pane-header-mini", ".tab-btn.active", ".icon-button.active-favorite", "pre[class", "code[class"]
view_components_keywords = [".component-card", ".registry-row", ".semantic-result-card"]
global_keywords = ["body", "h1", "h2", "h3", "h4", "h5", "h6", ".eyebrow", ".brand-logo", "p", "strong", "b", ".premium-props-table", ".secondary-button", ".quick-chip-btn", "button", "input", ".search-input-wrap", ".toast", ".notice", ".console-alert"]

dashboard_css = "/* Dashboard specific styles */\n"
auth_css = "/* Auth (Login/Signup) specific styles */\n"
component_details_css = "/* Component Details specific styles */\n"
view_components_css = "/* View Components specific styles */\n"
global_overrides = "/* Global Overrides */\n"

# A naive parser to split premium.css into rules
rules = re.findall(r'([^{]+)\{([^}]+)\}', premium_css)

for selector, body in rules:
    selector = selector.strip()
    if selector == ":root" or selector.startswith("@import"):
        continue
    
    rule = f"{selector} {{{body}}}\n\n"
    
    if any(k in selector for k in auth_keywords):
        auth_css += rule
    elif any(k in selector for k in dashboard_keywords):
        dashboard_css += rule
    elif any(k in selector for k in component_details_keywords):
        component_details_css += rule
    elif any(k in selector for k in view_components_keywords):
        view_components_css += rule
    else:
        global_overrides += rule

# Write to page files
with open(os.path.join(pages_dir, "Dashboard.css"), "w") as f: f.write(dashboard_css)
with open(os.path.join(pages_dir, "Auth.css"), "w") as f: f.write(auth_css)
with open(os.path.join(pages_dir, "ComponentDetails.css"), "w") as f: f.write(component_details_css)
with open(os.path.join(pages_dir, "ViewComponents.css"), "w") as f: f.write(view_components_css)
with open(os.path.join(pages_dir, "Admin.css"), "w") as f: f.write("/* Admin styles */\n")
with open(os.path.join(pages_dir, "Favorites.css"), "w") as f: f.write("/* Favorites styles */\n")
with open(os.path.join(pages_dir, "SearchComponents.css"), "w") as f: f.write("/* Search styles */\n")

# Process App.css -> global.css
with open(os.path.join(frontend_dir, "App.css"), "r", encoding="utf-8") as f:
    app_css = f.read()

app_css = re.sub(r':root(\[data-theme="light"\])?\s*\{.*?\n\}', '', app_css, flags=re.DOTALL)
final_global_css = f"{global_vars_str}\n{app_css}\n{global_overrides}"

with open(os.path.join(frontend_dir, "styles", "global.css"), "w", encoding="utf-8") as f:
    f.write(final_global_css)

print("CSS files distributed successfully.")
