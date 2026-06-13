const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

app.post('/api/platforms', [
    body('name').notEmpty().withMessage('Please, indicate the platform\'s name.'),
    body('company').notEmpty().withMessage('Please, indicate the platform\'s developer.'),
    checkValidation
], (req, res) => {
    const { name, company } = req.body;
    db.run('INSERT INTO platform (name, company) VALUES (?, ?)', [name, company], function(err) { 
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, company });
    });
});

app.get('/api/platforms', (req, res) => {
    db.all('SELECT * FROM platform', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.put('/api/platforms/:id', [
    body('name').notEmpty().withMessage('Please, indicate the platform\'s name.'),
    body('company').notEmpty().withMessage('Please, indicate the platform\'s developer.'),
    checkValidation
], (req, res) => {
    const { name, company } = req.body;
    db.run('UPDATE platform SET name = ?, company = ? WHERE id = ?', [name, company, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Platform updated.' });
    });
});

app.delete('/api/platforms/:id', (req, res) => {
    db.run('DELETE FROM platform WHERE id = ?', req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Platform deleted.' });
    });
});

app.post('/api/videogames', [
    body('title').notEmpty().withMessage('Please, indicate a title.'),
    body('platform_id').isInt().withMessage('Please, indicate a numerical ID.'),
    checkValidation
], (req, res) => {
    const { title, genre, release_year, platform_id } = req.body;
    const sql = 'INSERT INTO videogame (title, genre, release_year, platform_id) VALUES (?, ?, ?, ?)';
    db.run(sql, [title, genre, release_year, platform_id], function(err) {
        if (err) return res.status(500).json({ error: err.message});
        res.status(201).json({ id: this.lastID, title, genre, release_year, platform_id });
    });
});

app.get('/api/videogames', (req, res) => {
    const sql = `
        SELECT videogame.*, platform.name
        FROM videogame
        LEFT JOIN platform ON videogame.platform_id = platform.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/api/videogames/:id', [
    body('title').notEmpty().withMessage('Please, indicate a title.'),
    body('platform_id').isInt().withMessage('Please, indicate a numerical ID.'),
    checkValidation
], (req, res) => {
    const { title, genre, release_year, platform_id } = req.body;
    const sql = 'UPDATE videogame SET title = ?, genre = ?, release_year = ?, platform_id = ? WHERE id = ?';
    db.run(sql, [title, genre, release_year, platform_id, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Game updated.' });
    });
});

app.delete('/api/videogames/:id', (req, res) => {
    db.run('DELETE FROM videogame WHERE id = ?', req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Videogame deleted.' });
    });
});

app.listen(PORT, () => {
    console.log(`Server working in port ${PORT}`);
});
