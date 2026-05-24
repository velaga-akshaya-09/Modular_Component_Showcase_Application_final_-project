function ToastContainer({ toasts }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div className={`toast ${toast.type || "info"}`} key={toast.id}>
          <strong>{toast.title}</strong>
          {toast.message && <span>{toast.message}</span>}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;