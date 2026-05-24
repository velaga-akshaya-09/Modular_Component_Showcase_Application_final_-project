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
      .get(`/components/${id}`)
      .then((res) => {
        if (isMounted) {
          setComponent(res.data);
          setStatus(res.data ? "ready" : "missing");
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
  if (status === "missing") return <h2 className="page">Component not found.</h2>;
  if (status === "error") return <h2 className="page">Unable to load component. Check gateway/backend services.</h2>;

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
          <button type="button">Primary Action</button>
        </div>
      </section>

      <section className="detail-panel">
        <h2>Description</h2>
        <p>{component.description}</p>
      </section>

      <section className="detail-panel">
        <h2>Documentation</h2>
        <p>{component.documentation}</p>
      </section>

      <section className="detail-panel">
        <div className="code-header">
          <h2><CodeIcon /> Code Snippet</h2>
          <button type="button" className="icon-text-button" onClick={() => copyCode(component.codeSnippet)}>
            <CopyIcon /> Copy
          </button>
        </div>
        <pre>{component.codeSnippet}</pre>
      </section>

      <section className="detail-panel">
        <h2>Usage Example</h2>
        <pre>{component.usageExample}</pre>
      </section>
    </div>
  );
}

export default ComponentDetails;
