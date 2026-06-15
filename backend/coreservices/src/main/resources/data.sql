INSERT INTO components (name, category, description, documentation, code_snippet, usage_example, created_by, created_at, status)
VALUES 
('Primary Button', 'Buttons', 'A standard primary button for main actions.', 'Use this button for primary calls to action.', '<button className="btn-primary">Click Me</button>', '<PrimaryButton onClick={handleClick}>Submit</PrimaryButton>', 'Admin', CURRENT_TIMESTAMP, 'APPROVED'),
('Dark Navbar', 'Navigation', 'A sleek dark-themed navigation bar.', 'Includes logo slot and navigation links.', '<nav className="navbar-dark">...</nav>', '<DarkNavbar links={navLinks} />', 'Admin', CURRENT_TIMESTAMP, 'APPROVED'),
('Feature Card', 'Layout', 'A card component for highlighting features.', 'Accepts an icon, title, and description.', '<div className="feature-card">...</div>', '<FeatureCard icon={<Zap/>} title="Fast" />', 'Admin', CURRENT_TIMESTAMP, 'APPROVED')
ON CONFLICT DO NOTHING;
