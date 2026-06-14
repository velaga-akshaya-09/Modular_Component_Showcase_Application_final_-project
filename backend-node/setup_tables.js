const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://postgres:admin123@localhost:5432/modular_showcase'
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
          id BIGSERIAL PRIMARY KEY,
          component_id BIGINT REFERENCES components(id) ON DELETE CASCADE,
          user_email VARCHAR(150),
          rating INTEGER CHECK (rating BETWEEN 1 AND 5),
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS favorites (
          id BIGSERIAL PRIMARY KEY,
          user_email VARCHAR(150),
          component_id BIGINT REFERENCES components(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_email, component_id)
      );
    `);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    pool.end();
  }
}

run();
