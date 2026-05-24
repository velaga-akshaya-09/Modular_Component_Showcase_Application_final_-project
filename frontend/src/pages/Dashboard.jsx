import { useEffect, useMemo, useState } from "react";
import { ChartIcon, ClockIcon, ComponentsIcon, DocsIcon } from "../components/Icons";
import api from "../api/axios";

function Dashboard({ onToast }) {
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const [components, setComponents] = useState([]);
  const [status, setStatus] = useState("loading");

  const [form, setForm] = useState({
    name: "",
    category: "",
    documentation: "",
  });

  const [requestForm, setRequestForm] = useState({
    name: "",
    category: "",
    description: "",
    documentation: "",
  });

  const [requests, setRequests] = useState([]);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [requestStatus, setRequestStatus] = useState("idle");

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadDashboardData = async () => {
    setStatus("loading");

    try {
      const componentsRes = await api.get("/components", { headers: getAuthHeader() });

      setComponents(Array.isArray(componentsRes.data) ? componentsRes.data : []);
      setStatus("ready");
    } catch (error) {
      console.error("Dashboard load error:", error);
      setStatus("error");
      onToast?.({
        title: "Dashboard unavailable",
        message: "Could not load components and categories.",
        type: "error",
      });
    }
  };

  const loadRequests = async () => {
    try {
      const params = role === "ADMIN" ? undefined : { requestedBy: email };

      const res = await api.get("/components/requests", {
        params,
        headers: getAuthHeader(),
      });

      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Requests load error:", error);
      setRequests([]);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const requestParams = role === "ADMIN" ? undefined : { requestedBy: email };

    Promise.all([
      api.get("/components", { headers: getAuthHeader() }),
      api.get("/components/requests", {
        params: requestParams,
        headers: getAuthHeader(),
      }),
    ])
      .then(([componentsRes, requestsRes]) => {
        if (isMounted) {
          setComponents(Array.isArray(componentsRes.data) ? componentsRes.data : []);
          setRequests(Array.isArray(requestsRes.data) ? requestsRes.data : []);
          setStatus("ready");
        }
      })
      .catch((error) => {
        console.error("Initial dashboard error:", error);
        if (isMounted) setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [email, role]);

  const categoryNames = useMemo(() => {
    const componentDerived = components.map((item) => item.category).filter(Boolean);
    return [...new Set(componentDerived)];
  }, [components]);

  const categoryCounts = useMemo(
    () =>
      categoryNames.map((category) => ({
        name: category,
        count: components.filter((item) => item.category === category).length,
      })).filter((item) => item.count > 0),
    [categoryNames, components]
  );

  const latestComponents = components.slice(-5).reverse();
  const pendingRequests = requests.filter((item) => item.status === "PENDING");
  const myRequests = requests.filter((item) => item.requestedBy === email);

  const documentedCount = components.filter(
    (item) => item.documentation || item.usageExample
  ).length;

  const maxCategoryCount = Math.max(
    1,
    ...categoryCounts.map((item) => item.count)
  );

  const mostUsedComponent = categoryCounts.reduce(
    (topCategory, category) =>
      category.count > topCategory.count ? category : topCategory,
    { name: "None", count: 0 }
  );

  const addComponent = async (event) => {
    event.preventDefault();

    if (role !== "ADMIN") {
      setSaveStatus("forbidden");
      return;
    }

    setSaveStatus("saving");

    try {
      await api.post(
        "/components",
        {
          name: form.name,
          category: form.category || categoryNames[0] || "General",
          description: `${form.name} reusable UI component.`,
          documentation:
            form.documentation || "Documentation uploaded from the dashboard console.",
          codeSnippet: `<${form.name.replace(/\s+/g, "")} />`,
          usageExample: `<${form.name.replace(/\s+/g, "")} />`,
          createdBy: email || "admin",
        },
        { headers: getAuthHeader() }
      );

      setForm({ name: "", category: "", documentation: "" });
      setSaveStatus("saved");
      onToast?.({
        title: "Component added",
        message: `${form.name} is now available in the registry.`,
        type: "success",
      });
      await loadDashboardData();
    } catch (error) {
      console.error("Add component error:", error);
      setSaveStatus("error");
      onToast?.({
        title: "Save failed",
        message: "The component could not be added.",
        type: "error",
      });
    }
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    setRequestStatus("saving");

    try {
      await api.post(
        "/components/requests",
        {
          ...requestForm,
          category: requestForm.category || "General",
          description:
            requestForm.description ||
            `${requestForm.name} reusable UI component.`,
          requestedBy: email,
        },
        {
          headers: getAuthHeader(),
        }
      );

      setRequestForm({
        name: "",
        category: "",
        description: "",
        documentation: "",
      });

      setRequestStatus("submitted");
      onToast?.({
        title: "Request sent",
        message: "Admin can now review your component request.",
        type: "success",
      });
      await loadRequests();
    } catch (error) {
      console.error("Submit request error:", error);
      setRequestStatus("error");
      onToast?.({
        title: "Request failed",
        message: "Could not send your component request.",
        type: "error",
      });
    }
  };

  const reviewRequest = async (request, decision) => {
    try {
      if (decision === "accept") {
        await api.post(
          `/components/requests/${request.id}/accept`,
          {},
          { headers: getAuthHeader() }
        );

        onToast?.({
          title: "Request accepted",
          message: `${request.name} was added to the registry.`,
          type: "success",
        });
        await loadRequests();
        await loadDashboardData();
        return;
      }

      await api.post(
        `/components/requests/${request.id}/reject`,
        {},
        { headers: getAuthHeader() }
      );

      onToast?.({
        title: "Request rejected",
        message: `${request.name} was marked as rejected.`,
        type: "info",
      });
      await loadRequests();
    } catch (error) {
      console.error("Review request error:", error);
      onToast?.({
        title: "Review failed",
        message: "Could not update the request status.",
        type: "error",
      });
      await loadRequests();
    }
  };

  return (
    <main className="console-stage">
      <section className="console-window">
        <div className="console-main">
          <section className="role-hero">
            <div>
              <p className="eyebrow">{role === "ADMIN" ? "Admin Workspace" : "User Workspace"}</p>
              <h1>{role === "ADMIN" ? "Manage component operations" : "Explore and request reusable components"}</h1>
            </div>
            <span>{role === "ADMIN" ? `${pendingRequests.length} pending requests` : `${myRequests.length} personal requests`}</span>
          </section>

          {status === "loading" ? (
            <section className="stats-grid">
              {[0, 1, 2, 3].map((item) => (
                <article className="stat-card skeleton-card" key={item}>
                  <span className="skeleton-line short" />
                  <span className="skeleton-line" />
                  <span className="skeleton-line strong" />
                </article>
              ))}
            </section>
          ) : (
            <section className="stats-grid">
              <article className="stat-card">
                <ComponentsIcon />
                <span>Total Components</span>
                <strong>{components.length}</strong>
              </article>

              <article className="stat-card">
                <DocsIcon />
                <span>Categories</span>
                <strong>{categoryNames.length}</strong>
              </article>

              <article className="stat-card">
                <ChartIcon />
                <span>Most Used</span>
                <strong>{mostUsedComponent.name}</strong>
              </article>

              <article className="stat-card">
                <ClockIcon />
                <span>Recent Uploads</span>
                <strong>{latestComponents.length}</strong>
              </article>
            </section>
          )}

          {role === "ADMIN" ? (
            <>
              <form className="console-panel add-panel" onSubmit={addComponent}>
                <div>
                  <h2>Add New Component</h2>
                  <p>Choose a new reusable component to open it from here.</p>
                </div>

                <div className="add-grid">
                  <input
                    placeholder="Component Name"
                    value={form.name}
                    required
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                  />

                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                  >
                    <option value="">Category Dropdown</option>
                    {categoryNames.map((category) => (
                      <option
                        value={category}
                        key={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>

                  <input
                    placeholder="Upload Documentation"
                    value={form.documentation}
                    onChange={(event) =>
                      setForm({ ...form, documentation: event.target.value })
                    }
                  />

                  <button type="submit" disabled={saveStatus === "saving"}>
                    {saveStatus === "saving"
                      ? "Saving..."
                      : "Add New Component"}
                  </button>
                </div>

                {saveStatus === "error" && (
                  <p className="console-alert">Unable to save component.</p>
                )}

                {saveStatus === "saved" && (
                  <p className="console-success">
                    Component saved from backend console.
                  </p>
                )}
              </form>

              <section className="console-panel">
                <h2>Component Request Queue</h2>

                {pendingRequests.length === 0 && (
                  <p className="console-muted">No pending user requests.</p>
                )}

                {pendingRequests.length > 0 && (
                  <div className="queue-table">
                    <div className="queue-row queue-head">
                      <span>Name</span>
                      <span>Category</span>
                      <span>Requested By</span>
                      <span>Actions</span>
                    </div>

                    {pendingRequests.map((item) => (
                      <div className="queue-row" key={item.id}>
                        <span>{item.name}</span>
                        <span>{item.category || "General"}</span>
                        <span>{item.requestedBy || "User"}</span>

                        <span className="queue-actions">
                          <button
                            type="button"
                            onClick={() => reviewRequest(item, "accept")}
                          >
                            Accept
                          </button>

                          <button
                            type="button"
                            onClick={() => reviewRequest(item, "reject")}
                          >
                            Reject
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <>
              <form className="console-panel add-panel" onSubmit={submitRequest}>
                <div>
                  <h2>Request a Component</h2>
                  <p>Send a component request for admin review.</p>
                </div>

                <div className="request-grid">
                  <input
                    placeholder="Component Name"
                    value={requestForm.name}
                    required
                    onChange={(event) =>
                      setRequestForm({
                        ...requestForm,
                        name: event.target.value,
                      })
                    }
                  />

                  <input
                    placeholder="Category"
                    value={requestForm.category}
                    onChange={(event) =>
                      setRequestForm({
                        ...requestForm,
                        category: event.target.value,
                      })
                    }
                  />

                  <textarea
                    placeholder="Description"
                    value={requestForm.description}
                    onChange={(event) =>
                      setRequestForm({
                        ...requestForm,
                        description: event.target.value,
                      })
                    }
                  />

                  <textarea
                    placeholder="Documentation"
                    value={requestForm.documentation}
                    onChange={(event) =>
                      setRequestForm({
                        ...requestForm,
                        documentation: event.target.value,
                      })
                    }
                  />

                  <button type="submit" disabled={requestStatus === "saving"}>
                    {requestStatus === "saving"
                      ? "Sending..."
                      : "Request Component"}
                  </button>
                </div>

                {requestStatus === "submitted" && (
                  <p className="console-success">Request sent to admin.</p>
                )}

                {requestStatus === "error" && (
                  <p className="console-alert">Unable to send request.</p>
                )}
              </form>

              <section className="console-panel">
                <h2>My Component Requests</h2>

                {myRequests.length === 0 && (
                  <p className="console-muted">
                    You have not requested any components yet.
                  </p>
                )}

                {myRequests.length > 0 && (
                  <div className="queue-table">
                    <div className="queue-row queue-head">
                      <span>Name</span>
                      <span>Category</span>
                      <span>Status</span>
                      <span>Message</span>
                    </div>

                    {myRequests.map((item) => (
                      <div className="queue-row" key={item.id}>
                        <span>{item.name}</span>
                        <span>{item.category || "General"}</span>
                        <span
                          className={
                            item.status === "ACCEPTED" ? "accepted-dot" : ""
                          }
                        >
                          {item.status}
                        </span>
                        <span>{item.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          <div className="console-bottom-grid">
            <section className="console-panel chart-panel">
              <h2>Most Used Components</h2>

              <div className="bar-chart">
                {categoryCounts.map((item) => (
                  <div className="bar-item" key={item.name}>
                    <span
                      style={{
                        height: `${Math.max(
                          18,
                          (item.count / maxCategoryCount) * 112
                        )}px`,
                      }}
                    />
                    <small>{item.name.slice(0, 4)}</small>
                  </div>
                ))}
              </div>
            </section>

            <section className="console-panel activity-panel">
              <h2>Search Activity Log</h2>

              <dl>
                <div>
                  <dt>Total Used Components</dt>
                  <dd>{components.length}</dd>
                </div>

                <div>
                  <dt>Total First Component</dt>
                  <dd>{components[0]?.name || "None"}</dd>
                </div>

                <div>
                  <dt>Search Manner Relevant</dt>
                  <dd>{documentedCount}</dd>
                </div>

                <div>
                  <dt>Search Activity Log</dt>
                  <dd>{status === "ready" ? "Active" : "Pending"}</dd>
                </div>

                <div>
                  <dt>Search Admin Component</dt>
                  <dd>{role || "USER"}</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
