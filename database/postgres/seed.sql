INSERT INTO users (name, email, password, role)
SELECT seed.name, seed.email, seed.password, seed.role
FROM (
  VALUES
    ('Admin', 'admin@gmail.com', 'admin123', 'ADMIN'),
    ('User', 'user@gmail.com', 'user123', 'USER')
) AS seed(name, email, password, role)
WHERE NOT EXISTS (
  SELECT 1
  FROM users existing
  WHERE existing.email = seed.email
);

INSERT INTO categories (name, description)
SELECT seed.name, seed.description
FROM (
  VALUES
    ('Forms', 'Inputs, validators, and form workflows'),
    ('Navigation', 'Menus, tabs, breadcrumbs, and layout navigation'),
    ('Dashboard', 'Cards, charts, metrics, and reporting widgets'),
    ('Feedback', 'Alerts, toast messages, loaders, and modals')
) AS seed(name, description)
WHERE NOT EXISTS (
  SELECT 1
  FROM categories existing
  WHERE existing.name = seed.name
);

INSERT INTO components
  (name, category, description, documentation, code_snippet, usage_example, created_by)
SELECT
  seed.name,
  seed.category,
  seed.description,
  seed.documentation,
  seed.code_snippet,
  seed.usage_example,
  seed.created_by
FROM (
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
      'Multi Step Signup Wizard',
      'Forms',
      'Guided signup flow with validation, progress state, and review step.',
      'Use when collecting longer onboarding or profile data across multiple steps.',
      '<SignupWizard steps={steps} />',
      '<SignupWizard steps={steps} onComplete={createAccount} />',
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
      'Breadcrumb Trail',
      'Navigation',
      'Compact breadcrumb navigation for nested pages and detail screens.',
      'Pass the current route hierarchy so users can quickly return to parent views.',
      '<BreadcrumbTrail items={items} />',
      '<BreadcrumbTrail items={crumbs} onNavigate={navigate} />',
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
      'Activity Timeline',
      'Dashboard',
      'Chronological activity feed for audits, approvals, and recent events.',
      'Provide timestamped events and optional status metadata for each row.',
      '<ActivityTimeline events={events} />',
      '<ActivityTimeline events={auditEvents} emptyText="No activity yet" />',
      'admin@gmail.com'
    ),
    (
      'Data Table Toolbar',
      'Dashboard',
      'Reusable table controls for search, filters, export, and column actions.',
      'Place above dense data tables that need quick filtering and bulk actions.',
      '<DataTableToolbar />',
      '<DataTableToolbar filters={filters} onExport={exportCsv} />',
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
    ),
    (
      'Confirmation Modal',
      'Feedback',
      'Accessible confirmation dialog for destructive or high-impact actions.',
      'Use before deletes, publishes, approvals, and irreversible workflow changes.',
      '<ConfirmationModal open={open} />',
      '<ConfirmationModal open={open} title="Delete component?" onConfirm={remove} />',
      'admin@gmail.com'
    ),
    (
      'Empty State Panel',
      'Feedback',
      'Helpful empty state with icon, message, and primary recovery action.',
      'Use when lists, searches, dashboards, or admin queues have no records.',
      '<EmptyStatePanel title="No components" />',
      '<EmptyStatePanel title="No results" actionLabel="Clear search" onAction={reset} />',
      'admin@gmail.com'
    )
) AS seed(name, category, description, documentation, code_snippet, usage_example, created_by)
WHERE NOT EXISTS (
  SELECT 1
  FROM components existing
  WHERE existing.name = seed.name
);