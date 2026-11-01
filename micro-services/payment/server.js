
const express = require("express");

const app = express();

const cors = require("cors");
app.use(cors());


const PORT = 4000;

app.use(express.json());

// Temporary in-memory payments
let payments = [];
let nextPaymentId = 1;

// Health route
app.get("/", (req, res) => {
    res.json({
        message: "EdgePilot Payment Service is running"
    });
});

// Create payment (simulation only)
app.post("/payments", (req, res) => {
    const { orderId, amount, method } = req.body;

    if (
        !orderId ||
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !method
    ) {
        return res.status(400).json({
            success: false,
            message: "Valid orderId, amount and method are required"
        });
    }

    const payment = {
        id: nextPaymentId++,
        orderId,
        amount,
        method,
        status: "pending"
    };

    payments.push(payment);

    res.status(201).json({
        success: true,
        message: "Payment created successfully (simulation)",
        data: payment
    });
});

// Get all payments
app.get("/payments", (req, res) => {
    res.json({
        success: true,
        data: payments
    });
});

// Get payment by ID
app.get("/payments/:id", (req, res) => {
    const payment = payments.find(
        p => p.id === Number(req.params.id)
    );

    if (!payment) {
        return res.status(404).json({
            success: false,
            message: "Payment not found"
        });
    }

    res.json({
        success: true,
        data: payment
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Payment Service running on port ${PORT}`);
});
