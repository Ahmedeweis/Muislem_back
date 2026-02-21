
import pool from './db.js';

async function testDB() {
    try {
        console.log('Testing DB connection...');
        const res = await pool.query('SELECT NOW()');
        console.log('DB Connected:', res.rows[0]);

        console.log('Checking groups table...');
        const groups = await pool.query('SELECT * FROM groups LIMIT 1');
        console.log('Groups table exists, count:', groups.rowCount);

        console.log('Checking group_juz table...');
        const juz = await pool.query('SELECT * FROM group_juz LIMIT 1');
        console.log('Group_juz table exists, count:', juz.rowCount);

        console.log('Checking columns in group_juz...');
        const cols = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'group_juz'
    `);
        console.log('Columns:', cols.rows.map(r => r.column_name));

    } catch (err) {
        console.error('DB Error:', err);
    } finally {
        pool.end();
    }
}

testDB();
