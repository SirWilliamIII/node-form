const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8000;
app.use(bodyParser.urlencoded({ extended: false }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 't00r',
    database: 'form_server'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.get('/', (req, res) => {
    res.send(`
        <form action="/submit" method="post">
            <input type="email" name="email" required>
            <input type="password" name="password" required>
            <input type="text" name="message" required>
            <input type="submit" value="Submit">
        </form>
    `);
});

app.post('/submit', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { email: req.body.email, password: hashedPassword, message: req.body.message };
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, user, (err, result) => {
        if (err) throw err;
        res.redirect('/messages');
    });
});

app.get('/messages', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) throw err;
        let html = '<ul>';
        results.forEach(user => {
            html += `<li>${user.message} <a href="/edit/${user.id}">Edit</a> <a href="/delete/${user.id}">Delete</a></li>`;
        });
        html += '</ul>';
        res.send(html);
    });
});

app.get('/edit/:id', (req, res) => {
    // Implement edit functionality here
});

app.get('/delete/:id', (req, res) => {
    // Implement delete functionality here
});

app.listen(PORT, () => {
    console.log(`Server started on port ${ PORT }`);
});