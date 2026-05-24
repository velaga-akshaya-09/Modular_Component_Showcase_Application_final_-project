function Unauthorized() {
  return (
    <main className="page-shell">
      <section className="auth-card">
        <p className="eyebrow">Access Denied</p>
        <h1>Unauthorized</h1>
        <p>You do not have permission to view this page.</p>
      </section>
    </main>
  );
}

export default Unauthorized;