
import pool from './db.js';

const migrationQuery = `
DROP TABLE IF EXISTS daily_habits;

CREATE TABLE IF NOT EXISTS daily_habits (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES group_members(id) ON DELETE CASCADE,
    day_number INTEGER CHECK (day_number BETWEEN 1 AND 30),
    morning_athkar BOOLEAN DEFAULT FALSE,
    qiyam_rakaat INTEGER DEFAULT 0,
    duaa BOOLEAN DEFAULT FALSE,
    prayers_jamaah JSONB DEFAULT '[false, false, false, false, false]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, day_number)
);
`;

async function runMigration() {
    try {
        console.log('Migrating daily_habits to 30-day model...');
        await pool.query(migrationQuery);
        console.log('Migration successful.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

runMigration();
