// Database
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'eatai',
  host: process.env.POSTGRES_HOST || 'postgres',
  database: process.env.POSTGRES_DB || 'eatai_db',
  password: process.env.POSTGRES_PASSWORD || 'eatai123',
  port: process.env.POSTGRES_PORT || 5432,
});

// Error
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Export
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool
};