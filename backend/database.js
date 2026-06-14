const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./videogames.db', (err) => {
    if (err) {
        console.error('Error connecting with SQLite:', err.message);
    } else {
        console.log('Connection established.');
    }

        db.serialize(() => {
            
            db.run(`CREATE TABLE IF NOT EXISTS platform (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                company TEXT NOT NULL
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS store (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                format TEXT NOT NULL
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS videogame (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                genre TEXT,
                release_year INTEGER,
                platform_id INTEGER,
                store_id INTEGER,
                image TEXT,
                FOREIGN KEY(platform_id) REFERENCES platform(id),
                FOREIGN KEY(store_id) REFERENCES store(id)
            )`);
        });
});



module.exports = db;