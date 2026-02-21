
import pool from './db.js';

const migrationQuery = `
-- Drop old table
DROP TABLE IF EXISTS group_juz;

-- Create Members Table
CREATE TABLE IF NOT EXISTS group_members (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Progress Table
CREATE TABLE IF NOT EXISTS member_progress (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES group_members(id) ON DELETE CASCADE,
    juz_number INTEGER CHECK (juz_number BETWEEN 1 AND 30),
    status VARCHAR(50) DEFAULT 'completed', -- We only track completed ones really
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, juz_number)
);
`;

async function runMigration() {
    try {
        console.log('Running migration to member-based progress...');
        await pool.query(migrationQuery);
        console.log('Migration successful.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

runMigration();
