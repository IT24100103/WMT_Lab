const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const router = express.Router();

// TOTAL SPENT
router.get('/total-spent/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const result = await Order.aggregate([
            { $match: { student: new mongoose.Types.ObjectId(studentId) } },
            {
                $group: {
                    _id: "$student",
                    totalSpent: { $sum: "$totalPrice" }
                }
            }
        ]);

        res.json({
            studentId,
            totalSpent: result[0]?.totalSpent || 0
        });

    } catch {
        res.status(500).json({ error: "Server error" });
    }
});

// TOP MENU ITEMS
router.get('/top-menu-items', async (req, res) => {
    try {
        const result = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.menuItem",
                    totalQuantity: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);

        res.json(result);

    } catch {
        res.status(500).json({ error: "Server error" });
    }
});

// DAILY ORDERS
router.get('/daily-orders', async (req, res) => {
    try {
        const result = await Order.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(result);

    } catch {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;