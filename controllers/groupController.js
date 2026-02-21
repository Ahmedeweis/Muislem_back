import pool from '../db.js';

export const getAllGroups = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT id, name, created_at, 
      CASE WHEN password IS NOT NULL AND password <> '' THEN true ELSE false END as is_private 
      FROM groups 
      ORDER BY created_at DESC
    `);
        res.json(result.rows);
    } catch (err) {
        console.error('Get All Groups Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createGroup = async (req, res) => {
    const { name, password } = req.body;
    if (!name) return res.status(400).json({ error: 'Group name is required' });

    try {
        const result = await pool.query(
            'INSERT INTO groups (name, password) VALUES ($1, $2) RETURNING id, name',
            [name, password || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Create Group Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Verify password for private groups (before showing details)
export const verifyGroup = async (req, res) => {
    const { groupId, password } = req.body;
    try {
        const groupRes = await pool.query('SELECT password FROM groups WHERE id = $1', [groupId]);
        const group = groupRes.rows[0];

        if (!group) return res.status(404).json({ error: 'Group not found' });

        if (group.password && group.password !== password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getGroupDetails = async (req, res) => {
    const { id } = req.params;
    try {
        // Group Info
        const groupRes = await pool.query('SELECT name, CASE WHEN password IS NOT NULL AND password <> \'\' THEN true ELSE false END as is_private FROM groups WHERE id = $1', [id]);
        const group = groupRes.rows[0];
        if (!group) return res.status(404).json({ error: 'Group not found' });

        // Get Members
        const membersRes = await pool.query('SELECT id, name FROM group_members WHERE group_id = $1 ORDER BY created_at ASC', [id]);
        const members = membersRes.rows;

        // Get Progress for all members in this group
        // Optimization: Fetch all progress for these members in one query
        const memberIds = members.map(m => m.id);
        let progressMap = {}; // member_id -> Set of completed juz

        if (memberIds.length > 0) {
            const progressRes = await pool.query('SELECT member_id, juz_number FROM member_progress WHERE member_id = ANY($1)', [memberIds]);
            progressRes.rows.forEach(r => {
                if (!progressMap[r.member_id]) progressMap[r.member_id] = [];
                progressMap[r.member_id].push(r.juz_number);
            });
        }

        // Attach progress to members
        const membersWithProgress = members.map(m => ({
            ...m,
            progress: progressMap[m.id] || []
        }));

        res.json({ group, members: membersWithProgress });
    } catch (err) {
        console.error('Get Details Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const addMember = async (req, res) => {
    const { groupId, name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        const result = await pool.query(
            'INSERT INTO group_members (group_id, name) VALUES ($1, $2) RETURNING id, name, created_at',
            [groupId, name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Add Member Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const toggleProgress = async (req, res) => {
    const { memberId, juzNumber, completed } = req.body;

    try {
        if (completed) {
            await pool.query(
                'INSERT INTO member_progress (member_id, juz_number, status) VALUES ($1, $2, \'completed\') ON CONFLICT DO NOTHING',
                [memberId, juzNumber]
            );
        } else {
            await pool.query(
                'DELETE FROM member_progress WHERE member_id = $1 AND juz_number = $2',
                [memberId, juzNumber]
            );
        }
        res.json({ success: true });
    } catch (err) {
        console.error('Toggle Progress Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

