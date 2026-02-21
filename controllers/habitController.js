import pool from '../db.js';


export const getDailyHabits = async (req, res) => {
    const { memberId, date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    if (!memberId) return res.status(400).json({ error: 'Member ID required' });

    try {
        const result = await pool.query(
            'SELECT * FROM daily_habits WHERE member_id = $1 AND date = $2',
            [memberId, targetDate]
        );

        if (result.rows.length === 0) {
            return res.json({
                date: targetDate,
                morning_athkar: false,
                qiyam_rakaat: 0,
                duaa: false,
                prayers_jamaah: [false, false, false, false, false]
            });
        }

        const data = result.rows[0];
        // Ensure prayers_jamaah is an array (pg might return it as object/array automatically depending on column type)
        // If stored as JSONB, pg returns it as object/array.

        res.json(data);
    } catch (err) {
        console.error('Get Habits Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateDailyHabits = async (req, res) => {
    const { memberId, date, morning_athkar, qiyam_rakaat, duaa, prayers_jamaah } = req.body;

    try {
        // Ensure prayers_jamaah is a valid JSON string or object for postgres
        const prayersJson = JSON.stringify(prayers_jamaah);

        const result = await pool.query(
            `INSERT INTO daily_habits (member_id, date, morning_athkar, qiyam_rakaat, duaa, prayers_jamaah)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (member_id, date)
       DO UPDATE SET 
         morning_athkar = $3,
         qiyam_rakaat = $4,
         duaa = $5,
         prayers_jamaah = $6
       RETURNING *`,
            [memberId, date, morning_athkar, qiyam_rakaat, duaa, prayersJson]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update Habits Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getHabitsHistory = async (req, res) => {
    const { memberId } = req.query;

    if (!memberId) return res.status(400).json({ error: 'Member ID required' });

    try {
        const result = await pool.query(
            'SELECT * FROM daily_habits WHERE member_id = $1 ORDER BY date DESC',
            [memberId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Get Habits History Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

