const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

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
    body('title').notEmpty().withMessage('Field "title" is compulsory'),
    body('platform_id').isInt().withMessage('Platform ID is compulsory')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

    const { title, genre, release_year, platform_id, store_id, image } = req.body;
    
    db.run(`INSERT INTO videogame (title, genre, release_year, platform_id, store_id, image) VALUES (?, ?, ?, ?, ?, ?)`, 
    [title, genre, release_year, platform_id, store_id, image], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

app.get('/api/videogames', (req, res) => {
    db.all("SELECT * FROM videogame", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/api/videogames/:id', [
    body('title').notEmpty().withMessage('Field "Title" is compulsory'),
    body('platform_id').isInt().withMessage('Platform ID is compulsory')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

    const { title, genre, release_year, platform_id, store_id, image } = req.body;
    
    db.run(`UPDATE videogame SET title = ?, genre = ?, release_year = ?, platform_id = ?, store_id = ?, image = ? WHERE id = ?`, 
    [title, genre, release_year, platform_id, store_id, image, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Game updated' });
    });
});

app.delete('/api/videogames/:id', (req, res) => {
    db.run(`DELETE FROM videogame WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Game deleted' });
    });
});

app.get('/api/stores', (req, res) => {
    db.all("SELECT * FROM store", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/stores', [
    body('name').notEmpty().withMessage('Field "Name" is compulsory'),
    body('format').notEmpty().withMessage('Field "Format" is compulsory')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

    const { name, format } =req.body;
    db.run(`INSERT INTO store (name, format) VALUES (?, ?)`, [name, format], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, format });
    });
});

app.put('/api/stores/:id', [
    body('name').notEmpty().withMessage('Field "Name" is compulsory'),
    body('format').notEmpty().withMessage('Field "Format" is compulsory')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errores : errors.array() });

    const { name, format } = req.body;
    db.run(`UPDATE store SET name = ?, format = ? WHERE id = ?`, [name, format, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Store updated' });
    }) ;
});

app.delete('/api/stores/:id', (req, res) => {
    db.run(`DELETE FROM store WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Store deleted' });    
    });
});

app.listen(PORT, () => {
    console.log(`Server working in port ${PORT}`);
});
