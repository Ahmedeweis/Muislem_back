-- Drop tables to reset for new model
DROP TABLE IF EXISTS daily_habits;
DROP TABLE IF EXISTS quran_progress;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS juz_transactions; -- cleanup if exists

-- Groups Table (Same as before)
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Juz Status Table
-- Tracks who is reading which Juz in a group.
-- 30 rows potentially per group, created on demand.
CREATE TABLE IF NOT EXISTS group_juz (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    juz_number INTEGER CHECK (juz_number BETWEEN 1 AND 30),
    reader_name VARCHAR(255), -- "Ahmed", "Guest", etc.
    status VARCHAR(50) DEFAULT 'available', -- available, reading, completed
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, juz_number)
);

-- Note: Daily Habits is temporarily orphaned/removed as we removed 'members'.
-- We can add it back later if needed, linked to a device-token instead of member-id.
