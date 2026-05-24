const gatewayUrl = "http://localhost:8000";
let allComponents = [];

const categoriesEl = document.querySelector("#categories");
const componentsEl = document.querySelector("#components");
const dialog = document.querySelector("#componentDialog");
const dialogContent = document.querySelector("#dialogContent");

async function api(path, options = {}) {
  const response = await fetch(`${gatewayUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

function renderCategories(categories) {
  categoriesEl.innerHTML = categories
    .map((category) => `<button data-category="${category.id}">${category.name}</button>`)
    .join("");

  categoriesEl.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.category);
      renderComponents(allComponents.filter((component) => component.categoryId === id));
    });
  });
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function previewHtml(component) {
  if (component.name.toLowerCase().includes("button")) {
    return `<button>${component.name}</button>`;
  }
  if (component.name.toLowerCase().includes("form")) {
    return `<input placeholder="Email address" /><button>Validate</button>`;
  }
  if (component.name.toLowerCase().includes("chart")) {
    return `<div class="tag">Revenue +18%</div><p class="meta">Dashboard widget preview</p>`;
  }
  return `<span class="tag">${component.categoryName || "Reusable UI"}</span>`;
}

function renderComponents(components) {
  componentsEl.innerHTML = components
    .map(
      (component) => `
        <article class="card">
          <div>
            <h3>${component.name}</h3>
            <p class="meta">${component.categoryName || "Uncategorized"}</p>
          </div>
          <div class="preview">${previewHtml(component)}</div>
          <p>${component.description}</p>
          <button data-id="${component.id}">View Docs</button>
        </article>
      `
    )
    .join("");

  componentsEl.querySelectorAll("button[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const component = allComponents.find((item) => item.id === Number(button.dataset.id));
      dialogContent.innerHTML = `
        <h2>${component.name}</h2>
        <p>${component.description}</p>
        <h3>Documentation</h3>
        <p>${component.documentation}</p>
        <h3>Usage</h3>
        <pre><code>${escapeHtml(component.usageExample)}</code></pre>
      `;
      dialog.showModal();
    });
  });
}

async function loadData() {
  const [categories, components] = await Promise.all([api("/categories"), api("/components")]);
  allComponents = components;
  renderCategories(categories);
  renderComponents(components);
}

document.querySelector("#searchBtn").addEventListener("click", async () => {
  const query = document.querySelector("#searchInput").value.trim();
  if (!query) return renderComponents(allComponents);
  const results = await api("/search/semantic", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
  const ids = new Set(results.map((item) => item.componentId));
  renderComponents(allComponents.filter((component) => ids.has(component.id)));
});

document.querySelector("#resetBtn").addEventListener("click", () => renderComponents(allComponents));

loadData().catch((error) => {
  componentsEl.innerHTML = `<p>Unable to load data. Start the gateway and backend first.</p>`;
  console.error(error);
});