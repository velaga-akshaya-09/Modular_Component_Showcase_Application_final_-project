INSERT INTO users (name, email, password, role) VALUES
  ('Admin', 'admin@gmail.com', 'admin123', 'ADMIN'),
  ('User', 'user@gmail.com', 'user123', 'USER')
ON CONFLICT (email) DO NOTHING;

INSERT INTO categories (name, description) VALUES
  ('Forms', 'Inputs, validators, and form workflows'),
  ('Navigation', 'Menus, tabs, breadcrumbs, and layout navigation'),
  ('Dashboard', 'Cards, charts, metrics, and reporting widgets'),
  ('Feedback', 'Alerts, toast messages, loaders, and modals')
ON CONFLICT (name) DO NOTHING;

INSERT INTO components
  (name, category, description, documentation, code_snippet, usage_example, created_by)
VALUES
  (
    'Validated Email Form',
    'Forms',
    'Reusable form component with email validation and inline error states.',
    'Use for login, signup, and profile forms requiring email validation.',
    '<ValidatedEmailForm required />',
    '<ValidatedEmailForm onSubmit={handleSubmit} />',
    'admin@gmail.com'
  ),
  (
    'Role Aware Sidebar',
    'Navigation',
    'Navigation sidebar that renders links based on user role.',
    'Provide the authenticated user role and route config to hide unauthorized links.',
    '<RoleAwareSidebar role="ADMIN" />',
    '<RoleAwareSidebar role={currentUser.role} items={routes} />',
    'admin@gmail.com'
  ),
  (
    'Revenue Metric Card',
    'Dashboard',
    'Dashboard widget for displaying KPI value, delta, and trend.',
    'Use inside analytics dashboards and reporting pages.',
    '<RevenueMetricCard value="42K" trend="up" />',
    '<RevenueMetricCard title="Revenue" value="$42K" delta="+12%" />',
    'admin@gmail.com'
  ),
  (
    'Async Toast Center',
    'Feedback',
    'Feedback component for success, error, and loading messages.',
    'Use around API operations to provide non-blocking status feedback.',
    '<ToastCenter position="top-right" />',
    '<ToastCenter messages={messages} onDismiss={dismissToast} />',
    'admin@gmail.com'
  );
