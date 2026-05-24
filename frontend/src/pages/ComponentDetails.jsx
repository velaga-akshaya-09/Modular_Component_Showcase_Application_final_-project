import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CodeIcon, CopyIcon, EyeIcon } from "../components/Icons";
import api from "../api/axios";

function ComponentDetails({ onToast }) {
  const { id } = useParams();
  const [component, setComponent] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    api
      .get("/components")
      .then((res) => {
        const records = Array.isArray(res.data) ? res.data : [];
        const selectedRecord = records.find((item) => String(item.id) === String(id));

        if (isMounted) {
          setComponent(selectedRecord || null);
          setStatus(selectedRecord ? "ready" : "missing");
        }
      })
      .catch(() => {
        if (isMounted) {
          setStatus("error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code || "<Component />");
    onToast?.({
      title: "Code copied",
      message: "Snippet copied to clipboard.",
      type: "success",
    });
  };

  const useComponent = async () => {
    const usage = component.usageExample || component.codeSnippet || `<${component.name?.replace(/\s+/g, "") || "Component"} />`;

    await navigator.clipboard.writeText(usage);
    onToast?.({
      title: "Usage copied",
      message: `${component.name} is ready to paste into your app.`,
      type: "success",
    });
  };

  if (status === "loading") {
    return (
      <div className="page">
        <div className="skeleton-detail">
          <span className="skeleton-line short" />
          <span className="skeleton-line title" />
          <span className="skeleton-line" />
          <span className="skeleton-line" />
          <span className="skeleton-line tall" />
        </div>
      </div>
    );
  }
  if (status === "missing" || status === "error") {
    return (
      <div className="page component-empty-page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Component Showcase</p>
            <h1>Reusable UI Component Registry</h1>
            <p>
              A curated library of production-ready interface patterns for forms, navigation,
              dashboards, and feedback states. Each entry includes a purpose, implementation
              snippet, usage example, category, and ownership details.
            </p>
          </div>
          <Link className="button-link" to="/components">
            Back to Library
          </Link>
        </div>

        <section className="detail-panel">
          <h2>About This Showcase</h2>
          <p>
            The showcase helps teams discover reusable components before building the same UI
            again. Users can browse available components after login, inspect documentation,
            copy ready-to-use examples, and search by name or description. Admin users can add
            new components so the registry grows with the application.
          </p>
        </section>

        <section className="detail-panel detail-meta-panel">
          <h2>Basic Details</h2>
          <dl className="component-meta-list detail-meta-list">
            <div>
              <dt>Storage</dt>
              <dd>PostgreSQL components table</dd>
            </div>
            <div>
              <dt>Access</dt>
              <dd>Visible after user login</dd>
            </div>
            <div>
              <dt>Admin</dt>
              <dd>Add and manage records</dd>
            </div>
            <div>
              <dt>Default Set</dt>
              <dd>10 starter components</dd>
            </div>
          </dl>
        </section>

        <section className="detail-panel">
          <h2>Included Component Areas</h2>
          <div className="showcase-detail-grid">
            <article>
              <h3>Forms</h3>
              <p>Email validation, multi-step signup flows, and guided data entry patterns.</p>
            </article>
            <article>
              <h3>Navigation</h3>
              <p>Role-aware sidebars, breadcrumbs, and helpers for moving through nested views.</p>
            </article>
            <article>
              <h3>Dashboards</h3>
              <p>Metric cards, activity timelines, and table toolbars for operational screens.</p>
            </article>
            <article>
              <h3>Feedback</h3>
              <p>Toast centers, confirmation dialogs, and empty states for clear user guidance.</p>
            </article>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">{component.category || "Uncategorized"}</p>
          <h1>{component.name}</h1>
          <p>Created by {component.createdBy || "unknown"} and stored as component ID {component.id}.</p>
        </div>
        <Link className="button-link" to="/components">
          Back to Library
        </Link>
      </div>

      <section className="detail-panel">
        <h2><EyeIcon /> Live Preview</h2>
        <div className="component-preview-box detail-preview">
          <strong>{component.name}</strong>
          <p>{component.description}</p>
          <button type="button" onClick={useComponent}>
            Use Component
          </button>
        </div>
      </section>

      <section className="detail-panel detail-meta-panel">
        <h2>Basic Details</h2>
        <dl className="component-meta-list detail-meta-list">
          <div>
            <dt>Name</dt>
            <dd>{component.name}</dd>
          </div>
          <div>
            <dt>Component ID</dt>
            <dd>{component.id}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{component.category || "Uncategorized"}</dd>
          </div>
          <div>
            <dt>Created By</dt>
            <dd>{component.createdBy || "Unknown"}</dd>
          </div>
          <div>
            <dt>Created At</dt>
            <dd>{component.createdAt ? new Date(component.createdAt).toLocaleString() : "Not recorded"}</dd>
          </div>
        </dl>
      </section>

      <section className="detail-panel">
        <h2>Description</h2>
        <p>{component.description || "No description added yet."}</p>
      </section>

      <section className="detail-panel">
        <h2>Documentation</h2>
        <p>{component.documentation || "No documentation added yet."}</p>
      </section>

      <section className="detail-panel">
        <div className="code-header">
          <h2><CodeIcon /> Code Snippet</h2>
          <button type="button" className="icon-text-button" onClick={() => copyCode(component.codeSnippet)}>
            <CopyIcon /> Copy
          </button>
        </div>
        <pre>{component.codeSnippet || "<Component />"}</pre>
      </section>

      <section className="detail-panel">
        <h2>Usage Example</h2>
        <pre>{component.usageExample || component.codeSnippet || "<Component />"}</pre>
      </section>
    </div>
  );
}

export default ComponentDetails;