import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AddComponent() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    documentation: "",
    codeSnippet: "",
    usageExample: "",
    createdBy: localStorage.getItem("email"),
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  if (role !== "ADMIN") {
    return <h2 className="page">Only ADMIN can add components</h2>;
  }

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Saving component to PostgreSQL..." });

    try {
      const res = await api.post("/components", form);
      setStatus({ type: "success", message: "Component saved successfully." });
      navigate(`/component/${res.data.id}`);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.detail || "Unable to save component. Check gateway/backend services.",
      });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Add Component</h1>
          <p>Create a reusable component record. The submitted data is persisted through the gateway into PostgreSQL.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={submit}>
        <input
          placeholder="Component Name"
          value={form.name}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Category"
          value={form.category}
          required
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          required
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <textarea
          placeholder="Documentation"
          value={form.documentation}
          required
          onChange={(e) => setForm({ ...form, documentation: e.target.value })}
        />

        <textarea
          placeholder="Code Snippet"
          value={form.codeSnippet}
          required
          onChange={(e) => setForm({ ...form, codeSnippet: e.target.value })}
        />

        <textarea
          placeholder="Usage Example"
          value={form.usageExample}
          required
          onChange={(e) => setForm({ ...form, usageExample: e.target.value })}
        />

        {status.message && <p className={`notice ${status.type === "error" ? "error" : ""}`}>{status.message}</p>}

        <button type="submit" disabled={status.type === "loading"}>
          {status.type === "loading" ? "Saving..." : "Add Component"}
        </button>
      </form>
    </div>
  );
}

export default AddComponent;