const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./videogames.sqlite', (err) => {
    if (err) {
        console.error('Error connecting with SQLite:', err.message);
    } else {
        console.log('Connection established.');
    }
});

module.exports = db;