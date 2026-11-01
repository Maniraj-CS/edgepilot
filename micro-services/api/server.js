
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 4000;

app.use(express.json());

// Temporary in-memory data
let products = [
    { id: 1, name: "Laptop", price: 65000, stock: 10 },
    { id: 2, name: "Keyboard", price: 1500, stock: 20 },
    { id: 3, name: "Mouse", price: 800, stock: 30 }
];

let orders = [];
let nextOrderId = 1;

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "EdgePilot API Service is running"
    });
});

// GET all products
app.get("/products", (req, res) => {
    res.json({
        success: true,
        data: products
    });
});

// GET product by ID
app.get("/products/:id", (req, res) => {
    const product = products.find(
        p => p.id === Number(req.params.id)
    );

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        data: product
    });
});

// CREATE order
app.post("/orders", (req, res) => {
    const { productId, quantity } = req.body;

    const product = products.find(
        p => p.id === Number(productId)
    );

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid quantity"
        });
    }

    if (product.stock < quantity) {
        return res.status(400).json({
            success: false,
            message: "Insufficient stock"
        });
    }

    const order = {
        id: nextOrderId++,
        productId: product.id,
        productName: product.name,
        quantity,
        totalPrice: product.price * quantity,
        status: "pending"
    };

    product.stock -= quantity;
    orders.push(order);

    res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order
    });
});

// GET all orders
app.get("/orders", (req, res) => {
    res.json({
        success: true,
        data: orders
    });
});

// GET order by ID
app.get("/orders/:id", (req, res) => {
    const order = orders.find(
        o => o.id === Number(req.params.id)
    );

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found"
        });
    }

    res.json({
        success: true,
        data: order
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`API Service running on port ${PORT}`);
});
