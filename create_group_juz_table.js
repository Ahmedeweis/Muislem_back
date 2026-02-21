
import pool from './db.js';

const createTableQuery = `
CREATE TABLE IF NOT EXISTS group_juz (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    juz_number INTEGER CHECK (juz_number BETWEEN 1 AND 30),
    reader_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'available',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, juz_number)
);
`;

async function runMigration() {
    try {
        console.log('Creating group_juz table...');
        await pool.query(createTableQuery);
        console.log('Table created successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

runMigration();
