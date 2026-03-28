const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

// Helper: calculate total price
async function calculateTotalPrice(items) {
    const ids = items.map(i => i.menuItem);
    const menuItems = await MenuItem.find({ _id: { $in: ids } });

    let priceMap = {};
    menuItems.forEach(m => {
        priceMap[m._id] = m.price;
    });

    let total = 0;

    for (let item of items) {
        if (!priceMap[item.menuItem]) throw new Error("Invalid menu item");
        total += priceMap[item.menuItem] * item.quantity;
    }

    return total;
}

// CREATE order
router.post('/', async (req, res) => {
    try {
        const { student, items } = req.body;

        if (!items || items.length === 0)
            return res.status(400).json({ error: "Items required" });

        const totalPrice = await calculateTotalPrice(items);

        const order = new Order({
            student,
            items,
            totalPrice
        });

        const saved = await order.save();

        const populated = await Order.findById(saved._id)
            .populate('student')
            .populate('items.menuItem');

        res.status(201).json(populated);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET all orders (pagination)
router.get('/', async (req, res) => {
    try {
        let { page = 1, limit = 5 } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('student')
            .populate('items.menuItem');

        const total = await Order.countDocuments();

        res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            orders
        });

    } catch {
        res.status(500).json({ error: "Server error" });
    }
});

// GET order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('student')
            .populate('items.menuItem');

        if (!order) return res.status(404).json({ error: "Not found" });

        res.json(order);
    } catch {
        res.status(400).json({ error: "Invalid ID" });
    }
});

// UPDATE status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('student').populate('items.menuItem');

        if (!order) return res.status(404).json({ error: "Not found" });

        res.json(order);
    } catch {
        res.status(400).json({ error: "Error updating" });
    }
});

// DELETE order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) return res.status(404).json({ error: "Not found" });

        res.json({ message: "Deleted successfully" });
    } catch {
        res.status(400).json({ error: "Invalid ID" });
    }
});

module.exports = router;