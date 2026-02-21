import pool from '../db.js';

export const getTestData = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM test_items ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching test data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createTestData = async (req, res) => {
    const { content } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO test_items (content) VALUES ($1) RETURNING *',
            [content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating test data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
