
import pool from './db.js';

const createHabitsTableQuery = `
CREATE TABLE IF NOT EXISTS daily_habits (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES group_members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    morning_athkar BOOLEAN DEFAULT FALSE,
    qiyam_rakaat INTEGER DEFAULT 0,
    duaa BOOLEAN DEFAULT FALSE,
    prayers_jamaah JSONB DEFAULT '[false, false, false, false, false]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, date)
);
`;

async function runMigration() {
    try {
        console.log('Creating daily_habits table...');
        await pool.query(createHabitsTableQuery);
        console.log('daily_habits table created successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

runMigration();
