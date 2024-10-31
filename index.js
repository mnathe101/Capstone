const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./users.db');

app.use(bodyParser.urlencoded({ extended: false }));

// Vulnerable login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // SQL Injection Vulnerability: Directly inserting user inputs into the query
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.get(query, (err, row) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else if (row) {
            res.send(`Welcome ${row.username}`);
        } else {
            res.send('Invalid credentials');
        }
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
