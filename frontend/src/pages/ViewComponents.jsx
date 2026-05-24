import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChartIcon,
  CloseIcon,
  CodeIcon,
  ComponentsIcon,
  CopyIcon,
  DocsIcon,
  EyeIcon,
  SearchIcon,
  TrashIcon,
} from "../components/Icons";
import api from "../api/axios";

function ViewComponents({ onToast }) {
  const [components, setComponents] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [status, setStatus] = useState("loading");
  const [searchStatus, setSearchStatus] = useState("idle");

  const loadData = useCallback(async () => {
    setStatus("loading");

    try {
      const componentsRes = await api.get("/components");
      setComponents(Array.isArray(componentsRes.data) ? componentsRes.data : []);
      setStatus("ready");
    } catch {
      setStatus("error");
      onToast?.({
        title: "Library unavailable",
        message: "Could not load component records.",
        type: "error",
      });
    }
  }, [onToast]);

  const runSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      await loadData();
      setSearchStatus("idle");
      return;
    }

    setSearchStatus("loading");

    try {
      const res = await api.get("/components/search", { params: { q: query } });
      setComponents(Array.isArray(res.data) ? res.data : []);
      setSearchStatus("ready");
      setStatus("ready");
      onToast?.({
        title: "Search complete",
        message: `${Array.isArray(res.data) ? res.data.length : 0} matching components found.`,
        type: "success",
      });
    } catch {
      setSearchStatus("error");
      onToast?.({
        title: "Search failed",
        message: "Could not search backend component records.",
        type: "error",
      });
    }
  };

  const deleteComponent = async (id) => {
    try {
      await api.delete(`/components/${id}`);
      setComponents((current) => current.filter((component) => component.id !== id));
      setSelectedComponent(null);
      onToast?.({
        title: "Component deleted",
        message: "Removed from the registry and database.",
        type: "info",
      });
      await loadData();
    } catch {
      onToast?.({
        title: "Delete failed",
        message: "The component could not be removed from the database.",
        type: "error",
      });
    }
  };

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code || "<Component />");
    onToast?.({
      title: "Code copied",
      message: "Snippet copied to clipboard.",
      type: "success",
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const categoryOptions = useMemo(() => {
    const componentDerived = components.map((item) => item.category).filter(Boolean);
    return ["All", ...new Set(componentDerived)];
  }, [components]);

  const activeCategory = categoryOptions.includes(selectedCategory) ? selectedCategory : "All";

  const filteredComponents = useMemo(() => {
    if (activeCategory === "All") {
      return components;
    }

    return components.filter((item) => item.category === activeCategory);
  }, [activeCategory, components]);

  const mostUsedCategory = useMemo(() => {
    const counts = categoryOptions
      .filter((category) => category !== "All")
      .map((category) => ({
        name: category,
        count: components.filter((item) => item.category === category).length,
      }));

    return counts.reduce(
      (topCategory, category) => (category.count > topCategory.count ? category : topCategory),
      { name: "None", count: 0 }
    );
  }, [categoryOptions, components]);

  const recentUploads = components.slice(-3).length;

  return (
    <main className="console-stage">
      <section className="console-window">
        <div className="console-main">
          <section className="stats-grid">
            <article className="stat-card">
              <ComponentsIcon />
              <span>Total Components</span>
              <strong>{components.length}</strong>
            </article>
            <article className="stat-card">
              <DocsIcon />
              <span>Categories</span>
              <strong>{categoryOptions.length - 1}</strong>
            </article>
            <article className="stat-card">
              <ChartIcon />
              <span>Most Used</span>
              <strong>{mostUsedCategory.name}</strong>
            </article>
            <article className="stat-card">
              <EyeIcon />
              <span>Recent Uploads</span>
              <strong>{recentUploads}</strong>
            </article>
          </section>

          <form className="console-panel component-search-panel" onSubmit={runSearch}>
            <div>
              <h2>All Components</h2>
              <p>Search and filter records collected from the Spring Boot backend.</p>
            </div>
            <div className="component-search-grid">
              <label className="search-input-wrap compact">
                <SearchIcon />
                <input
                  placeholder="Component Name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <select value={activeCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categoryOptions.map((category) => (
                  <option value={category} key={category}>{category}</option>
                ))}
              </select>
              <button type="submit" disabled={searchStatus === "loading"}>
                {searchStatus === "loading" ? "Searching..." : "Search"}
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("All");
                  loadData();
                }}
              >
                Reset
              </button>
            </div>
          </form>

          <section className="console-panel">
            <div className="section-title compact-title">
              <h2>Component Registry</h2>
              <span>{filteredComponents.length} records</span>
            </div>

            {status === "loading" && (
              <div className="component-registry">
                {[0, 1, 2].map((item) => (
                  <article className="registry-row skeleton-card" key={item}>
                    <div>
                      <span className="skeleton-line strong" />
                      <span className="skeleton-line" />
                    </div>
                    <span className="skeleton-line" />
                    <span className="skeleton-line" />
                    <span className="skeleton-line" />
                  </article>
                ))}
              </div>
            )}
            {status === "error" && <p className="console-alert">Unable to load components. Check gateway/backend services.</p>}
            {searchStatus === "error" && <p className="console-alert">Unable to search backend component records.</p>}
            {status === "ready" && filteredComponents.length === 0 && (
              <p className="console-muted">No components are available yet.</p>
            )}

            {status !== "loading" && <div className="component-registry">
              {filteredComponents.map((item) => (
                <article className="registry-row" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                  </div>
                  <span>{item.category || "Uncategorized"}</span>
                  <button type="button" onClick={() => setSelectedComponent(item)}>
                    <EyeIcon /> Open
                  </button>
                  {localStorage.getItem("role") === "ADMIN" && (
                    <button type="button" onClick={() => deleteComponent(item.id)}>
                      <TrashIcon /> Delete
                    </button>
                  )}
                </article>
              ))}
            </div>}
          </section>
        </div>
      </section>

      {selectedComponent && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedComponent(null)}>
          <section
            className="preview-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="preview-header">
              <div>
                <p className="eyebrow">{selectedComponent.category || "Uncategorized"}</p>
                <h2 id="preview-title">{selectedComponent.name}</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setSelectedComponent(null)} aria-label="Close preview">
                <CloseIcon />
              </button>
            </header>

            <div className="preview-grid">
              <article className="preview-card">
                <h3><EyeIcon /> Preview</h3>
                <div className="component-preview-box">
                  <strong>{selectedComponent.name}</strong>
                  <p>{selectedComponent.description}</p>
                  <button type="button">Primary Action</button>
                </div>
              </article>

              <article className="preview-card">
                <h3><DocsIcon /> Documentation</h3>
                <p>{selectedComponent.documentation || "No documentation added yet."}</p>
                <Link to={`/component/${selectedComponent.id}`}>Open full details</Link>
              </article>

              <article className="preview-card preview-code">
                <div className="code-header">
                  <h3><CodeIcon /> Code Snippet</h3>
                  <button type="button" className="icon-text-button" onClick={() => copyCode(selectedComponent.codeSnippet)}>
                    <CopyIcon /> Copy
                  </button>
                </div>
                <pre>{selectedComponent.codeSnippet || "<Component />"}</pre>
              </article>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default ViewComponents;
