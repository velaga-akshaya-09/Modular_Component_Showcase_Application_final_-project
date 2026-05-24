db = db.getSiblingDB("component_showcase");

db.component_descriptions.deleteMany({});
db.component_embeddings.deleteMany({});
db.usage_logs.deleteMany({});

const descriptions = [
  {
    componentId: 1,
    name: "Validated Email Form",
    text: "Form validation component for reusable login signup email input validation inline errors required fields.",
  },
  {
    componentId: 2,
    name: "Role Aware Sidebar",
    text: "Reusable navigation component for dashboards admin panels role based access sidebar menu.",
  },
  {
    componentId: 3,
    name: "Revenue Metric Card",
    text: "Reusable dashboard widget metric card analytics chart KPI revenue trend reporting.",
  },
  {
    componentId: 4,
    name: "Async Toast Center",
    text: "Feedback component for API loading success error toast notifications async operations.",
  },
];

function embedding(text) {
  const vector = Array(32).fill(0);
  text.toLowerCase().split(/\s+/).forEach((token) => {
    let hash = 0;
    for (let i = 0; i < token.length; i += 1) {
      hash = (hash * 31 + token.charCodeAt(i)) % 9973;
    }
    vector[hash % 32] += 1;
  });
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  return vector.map((value) => (norm ? value / norm : value));
}

db.component_descriptions.insertMany(descriptions);
db.component_embeddings.insertMany(
  descriptions.map((item) => ({
    componentId: item.componentId,
    embedding: embedding(item.text),
  }))
);

db.component_descriptions.createIndex({ componentId: 1 }, { unique: true });
db.component_embeddings.createIndex({ componentId: 1 }, { unique: true });
db.usage_logs.createIndex({ createdAt: -1 });