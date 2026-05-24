import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchIcon } from "../components/Icons";
import api from "../api/axios";

function SearchComponents({ onToast }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");

  const search = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setResults([]);
      setStatus("idle");
      return;
    }

    setStatus("loading");

    try {
      const res = await api.post("/search/semantic", {
        query,
        userEmail: localStorage.getItem("email"),
      });
      setResults(Array.isArray(res.data) ? res.data : []);
      setStatus("ready");
      onToast?.({
        title: "AI search complete",
        message: `${Array.isArray(res.data) ? res.data.length : 0} semantic matches returned.`,
        type: "success",
      });
    } catch {
      setResults([]);
      setStatus("error");
      onToast?.({
        title: "AI search failed",
        message: "Semantic search service is unavailable.",
        type: "error",
      });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Search</p>
          <h1>Intelligent Component Search</h1>
          <p>Search by functionality and use case using MongoDB-backed semantic matching.</p>
        </div>
      </div>

      <form className="search-box" onSubmit={search}>
        <label className="search-input-wrap">
          <SearchIcon />
          <input
            placeholder="Example: Form validation components"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Searching..." : "Search"}
        </button>
      </form>

      {status === "error" && <p className="notice error">Unable to search. Check gateway/backend services.</p>}
      {status === "loading" && (
        <section className="ai-search-animation">
          <div className="ai-orbit" />
          <div>
            <strong>Mapping semantic intent</strong>
            <span>Scanning component descriptions, examples, and usage patterns...</span>
          </div>
        </section>
      )}
      {status === "ready" && results.length === 0 && <p className="notice">No matching components found.</p>}

      <div className="cards">
        {status === "loading" &&
          [0, 1, 2].map((item) => (
            <article className="component-card skeleton-card" key={item}>
              <span className="skeleton-line short" />
              <span className="skeleton-line strong" />
              <span className="skeleton-line" />
              <span className="skeleton-line" />
            </article>
          ))}
        {results.map((item) => (
          <article className="component-card" key={item.id}>
            <p className="eyebrow">{item.category || "Uncategorized"}</p>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            {typeof item.semanticScore === "number" && (
              <span className="score-pill">Semantic score {(item.semanticScore * 100).toFixed(0)}%</span>
            )}
            <Link to={`/component/${item.id}`}>View Details</Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default SearchComponents;
