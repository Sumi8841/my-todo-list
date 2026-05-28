const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token required' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields are required' });
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
            if (err) return res.status(400).json({ error: 'Email already registered' });
            res.status(201).json({ message: 'User created' });
        });
    } catch { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) return res.status(400).json({ error: 'User not found' });
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username: user.username });
    });
});

app.get('/api/tasks', verifyToken, (req, res) => {
    db.query('SELECT * FROM todos WHERE user_id = ? ORDER BY createdAt DESC', [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/tasks', verifyToken, (req, res) => {
    const { task, category, due_date } = req.body;
    if (!task) return res.status(400).json({ error: 'Task cannot be empty' });
    
    db.query('INSERT INTO todos (task, category, due_date, user_id) VALUES (?, ?, ?, ?)', [task, category, due_date, req.user.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, task, category, due_date, status: 'active', user_id: req.user.id });
    });
});

app.put('/api/tasks/:id/toggle', verifyToken, (req, res) => {
    db.query("UPDATE todos SET status = CASE WHEN status = 'active' THEN 'completed' ELSE 'active' END WHERE id = ? AND user_id = ?", [req.params.id, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Status toggled' });
    });
});

app.put('/api/tasks/:id/edit', verifyToken, (req, res) => {
    const { newTaskText, due_date } = req.body;
    if (!newTaskText) return res.status(400).json({ error: 'Updated task cannot be empty' });
    db.query("UPDATE todos SET task = ?, due_date = ? WHERE id = ? AND user_id = ?", [newTaskText, due_date, req.params.id, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Task updated successfully' });
    });
});

app.delete('/api/tasks/:id', verifyToken, (req, res) => {
    db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted' });
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));