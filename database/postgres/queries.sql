SELECT * FROM users;

SELECT * FROM categories;

SELECT * FROM components;

SELECT * FROM usage_logs;

SELECT * FROM components
WHERE category ILIKE '%Forms%';

SELECT * FROM components
WHERE name ILIKE '%form%'
OR description ILIKE '%form%';