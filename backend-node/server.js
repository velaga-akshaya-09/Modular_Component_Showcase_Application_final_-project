const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test PostgreSQL connection
pgPool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
  } else {
    console.log('PostgreSQL Connected successfully');
  }
});

// MongoDB Connection
let mongoClient = null;
let mongoDb = null;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB_NAME = process.env.MONGO_DB || 'component_showcase';

async function connectMongo() {
  try {
    mongoClient = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    await mongoClient.connect();
    // ping db
    await mongoClient.db('admin').command({ ping: 1 });
    mongoDb = mongoClient.db(MONGO_DB_NAME);
    console.log('MongoDB Connected successfully');
  } catch (err) {
    console.warn('MongoDB connection failed, running in fallback mode:', err.message);
    mongoClient = null;
    mongoDb = null;
  }
}
connectMongo();

// Helper to log review actions to MongoDB
async function logToMongo(action, details) {
  if (!mongoDb) return;
  try {
    const logsCollection = mongoDb.collection('usage_logs');
    await logsCollection.insertOne({
      action,
      ...details,
      createdAt: new Date()
    });
    console.log(`Log written to MongoDB for action: ${action}`);
  } catch (err) {
    console.error('Error writing log to MongoDB:', err.message);
  }
}

// JWT Authentication Middleware
const JWT_SECRET = process.env.JWT_SECRET || 'componentshowcasesecretkeycomponentshowcasesecretkey';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    
    // Spring Boot puts the user email in the subject field ('sub')
    req.user = {
      email: decoded.sub,
      role: decoded.role || 'USER'
    };
    next();
  });
}

// --- ROLE-BASED ACCESS CONTROL (RBAC) ---

const rolePermissions = {
  ADMIN: [
    'read:reviews',
    'create:review',
    'update:review_any',
    'delete:review_any',
    'read:favorites',
    'create:favorite',
    'delete:favorite_own',
    'admin:full_control'
  ],
  USER: [
    'read:reviews',
    'create:review',
    'update:review_own',
    'delete:review_own',
    'read:favorites',
    'create:favorite',
    'delete:favorite_own'
  ]
};

function hasPermission(role, permission) {
  const perms = rolePermissions[role] || [];
  return perms.includes(permission) || perms.includes('admin:full_control');
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Access denied. Not authenticated.' });
    }
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ error: `Forbidden: Missing required permission (${permission}).` });
    }
    next();
  };
}

// --- REVIEW ROUTES ---

// 1. Get all reviews or filter by componentId
app.get('/api/reviews', async (req, res) => {
  const { componentId } = req.query;
  try {
    let query = 'SELECT * FROM reviews';
    let params = [];
    
    if (componentId) {
      query += ' WHERE component_id = $1';
      params.push(componentId);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pgPool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reviews:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Submit a review (JWT required)
app.post('/api/reviews', authenticateToken, requirePermission('create:review'), async (req, res) => {
  const { componentId, rating, comment } = req.body;
  const userEmail = req.user.email;

  if (!componentId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid review fields. Rating must be 1-5.' });
  }

  try {
    // Check if user already reviewed this component
    const checkQuery = 'SELECT id FROM reviews WHERE component_id = $1 AND user_email = $2';
    const checkRes = await pgPool.query(checkQuery, [componentId, userEmail]);
    if (checkRes.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this component. Please edit your existing review.' });
    }

    const insertQuery = `
      INSERT INTO reviews (component_id, user_email, rating, comment, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;
    const result = await pgPool.query(insertQuery, [componentId, userEmail, rating, comment || '']);
    const review = result.rows[0];

    // Log action to MongoDB
    await logToMongo('create_review', {
      userEmail,
      componentId: parseInt(componentId),
      rating: parseInt(rating),
      reviewId: review.id
    });

    res.status(201).json(review);
  } catch (err) {
    console.error('Error creating review:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Update a review (JWT required, owner only)
app.put('/api/reviews/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userEmail = req.user.email;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid rating. Must be 1-5.' });
  }

  try {
    // Check review ownership
    const checkQuery = 'SELECT user_email, component_id FROM reviews WHERE id = $1';
    const checkRes = await pgPool.query(checkQuery, [id]);
    
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    const review = checkRes.rows[0];
    const isOwner = review.user_email === userEmail;
    const canUpdateAny = hasPermission(req.user.role, 'update:review_any');
    const canUpdateOwn = hasPermission(req.user.role, 'update:review_own');

    if (!canUpdateAny && !(isOwner && canUpdateOwn)) {
      return res.status(403).json({ error: 'Unauthorized to update this review.' });
    }

    const updateQuery = `
      UPDATE reviews 
      SET rating = $1, comment = $2, created_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    const result = await pgPool.query(updateQuery, [rating, comment || '', id]);
    const updatedReview = result.rows[0];

    // Log action to MongoDB
    await logToMongo('update_review', {
      userEmail,
      componentId: review.component_id,
      rating: parseInt(rating),
      reviewId: parseInt(id)
    });

    res.json(updatedReview);
  } catch (err) {
    console.error('Error updating review:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Delete a review (JWT required, owner or admin only)
app.delete('/api/reviews/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userEmail = req.user.email;

  try {
    // Check review ownership
    const checkQuery = 'SELECT user_email, component_id FROM reviews WHERE id = $1';
    const checkRes = await pgPool.query(checkQuery, [id]);
    
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    const review = checkRes.rows[0];
    const isOwner = review.user_email === userEmail;
    const canDeleteAny = hasPermission(req.user.role, 'delete:review_any');
    const canDeleteOwn = hasPermission(req.user.role, 'delete:review_own');

    if (!canDeleteAny && !(isOwner && canDeleteOwn)) {
      return res.status(403).json({ error: 'Unauthorized to delete this review.' });
    }

    const deleteQuery = 'DELETE FROM reviews WHERE id = $1';
    await pgPool.query(deleteQuery, [id]);

    // Log action to MongoDB
    await logToMongo('delete_review', {
      userEmail,
      componentId: review.component_id,
      reviewId: parseInt(id)
    });

    res.json({ message: 'Review deleted successfully.' });
  } catch (err) {
    console.error('Error deleting review:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// --- FAVORITES ROUTES ---

// 1. Get all favorites for the logged-in user (JWT required)
app.get('/api/favorites', authenticateToken, requirePermission('read:favorites'), async (req, res) => {
  const userEmail = req.user.email;
  try {
    const query = `
      SELECT f.id AS favorite_id, f.created_at AS favorited_at, c.*
      FROM favorites f
      JOIN components c ON f.component_id = c.id
      WHERE f.user_email = $1
      ORDER BY f.created_at DESC
    `;
    const result = await pgPool.query(query, [userEmail]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching favorites:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Add a component to favorites (JWT required)
app.post('/api/favorites', authenticateToken, requirePermission('create:favorite'), async (req, res) => {
  const { componentId } = req.body;
  const userEmail = req.user.email;

  if (!componentId) {
    return res.status(400).json({ error: 'Component ID is required.' });
  }

  try {
    const insertQuery = `
      INSERT INTO favorites (user_email, component_id, created_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_email, component_id) DO NOTHING
      RETURNING *
    `;
    const result = await pgPool.query(insertQuery, [userEmail, componentId]);
    
    // Log favorite activity to MongoDB
    await logToMongo('add_favorite', {
      userEmail,
      componentId: parseInt(componentId)
    });

    res.status(201).json(result.rows[0] || { message: 'Already favorited' });
  } catch (err) {
    console.error('Error adding favorite:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Remove a component from favorites (JWT required)
app.delete('/api/favorites/component/:componentId', authenticateToken, requirePermission('delete:favorite_own'), async (req, res) => {
  const { componentId } = req.params;
  const userEmail = req.user.email;

  try {
    const deleteQuery = 'DELETE FROM favorites WHERE user_email = $1 AND component_id = $2 RETURNING *';
    const result = await pgPool.query(deleteQuery, [userEmail, componentId]);

    // Log unfavorite activity to MongoDB
    await logToMongo('remove_favorite', {
      userEmail,
      componentId: parseInt(componentId)
    });

    res.json({ message: 'Removed from favorites successfully.', deletedCount: result.rowCount });
  } catch (err) {
    console.error('Error removing favorite:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- PERMISSIONS ROUTE ---
// 1. List available permissions for roles
app.get('/api/permissions', (req, res) => {
  const result = {};
  for (const [role, perms] of Object.entries(rolePermissions)) {
    result[role] = {
      count: perms.length,
      controls: perms
    };
  }
  res.json(result);
});

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Modular Component Showcase Node.js Service Running' });
});

app.listen(PORT, () => {
  console.log(`Node.js backend listening on port ${PORT}`);
});
