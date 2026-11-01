
const express = require("express");

const app = express();

const cors = require("cors");
app.use(cors());

const PORT = 4000;

app.use(express.json());

// Temporary in-memory users
let users = [];
let nextUserId = 1;

// Health route
app.get("/", (req, res) => {
    res.json({
        message: "EdgePilot Auth Service is running"
    });
});

// Register user
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required"
        });
    }

    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "Email already registered"
        });
    }

    const user = {
        id: nextUserId++,
        name,
        email
    };

    users.push({
        ...user,
        password
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user
    });
});

// Login user (demo only)
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        user =>
            user.email === email &&
            user.password === password
    );

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    res.json({
        success: true,
        message: "Login successful",
        data: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// Get all users (demo endpoint)
app.get("/users", (req, res) => {
    res.json({
        success: true,
        data: users.map(({ password, ...user }) => user)
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Auth Service running on port ${PORT}`);
});
