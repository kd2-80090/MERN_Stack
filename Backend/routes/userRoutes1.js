
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const connectDetails = {
    host: "localhost",
    database: "save_user",
    user: "root",
    password: "manager"
};

router.post("/signup", (req, res) => {
    const connection = mysql.createConnection(connectDetails);

    const { last_name, first_name, email, password, age } = req.body;

    if (!last_name || !first_name || !email || !password || !age) {
        connection.end(); 
        return res.status(400).json({ error: "Missing required fields" });
    }

    const selectQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(selectQuery, [email], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query for email check:', error);
            connection.end(); 
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            connection.end(); 
            return res.status(409).json({ error: 'User with email already exists' });
        }

        const insertQuery = "INSERT INTO users (last_name, first_name, email, password, age) VALUES (?, ?, ?, ?, ?)";
        connection.query(insertQuery, [last_name, first_name, email, password, age], (error, result) => {
            connection.end(); 
            if (error) {
                console.error('Error executing MySQL query for user creation:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(201).json({ message: "User created successfully", user_id: result.insertId });
        });
    });
});

router.post("/signin", (req, res) => {
    const connection = mysql.createConnection(connectDetails);

    const { email, password } = req.body;

    if (!email || !password) {
        connection.end(); 
        return res.status(400).json({ error: "Email and password are required" });
    }

    const selectQuery = "SELECT * FROM users WHERE email = ? AND password = ?";
    connection.query(selectQuery, [email, password], (error, results) => {
        connection.end(); 

        if (error) {
            console.error('Error executing MySQL query for login:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
        res.status(200).json({
            message: 'Login successful',
            user: {
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                age: user.age
            }
        });
    });
});


router.get("/getAllUsers", (req, res) => {
    const connection = mysql.createConnection(connectDetails);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const statement = "SELECT user_id, last_name ,first_name, email, age  FROM users"; 
        connection.query(statement, (error, result) => {
            connection.end();

            if (error) {
                console.error('Error executing MySQL query: ', error);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            res.status(200).json(result);
        });
    });
});



module.exports = router;
