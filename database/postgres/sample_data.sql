INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@gmail.com', 'admin123', 'ADMIN'),
('User', 'user@gmail.com', 'user123', 'USER');

INSERT INTO categories (name, description) VALUES
('Forms', 'Login forms, signup forms, validation forms'),
('Dashboard', 'Cards, charts, metrics and widgets'),
('Navigation', 'Navbar, sidebar, menu components'),
('Feedback', 'Alerts, modals, toast messages');

INSERT INTO components 
(name, category, description, documentation, code_snippet, usage_example, created_by)
VALUES
(
'Login Form',
'Forms',
'Reusable login form with email and password fields',
'Used for authentication pages where users enter login details.',
'<LoginForm />',
'import LoginForm from "./LoginForm";',
'admin@gmail.com'
),
(
'Dashboard Card',
'Dashboard',
'Reusable card for showing statistics',
'Used in admin dashboards to show numbers like users, sales, tasks.',
'<DashboardCard />',
'<DashboardCard title="Users" value="120" />',
'admin@gmail.com'
),
(
'Sidebar Menu',
'Navigation',
'Reusable sidebar navigation menu',
'Used to navigate between dashboard pages.',
'<Sidebar />',
'<Sidebar items={menuItems} />',
'admin@gmail.com'
);