const express = require('express');
const Student = require('../models/Student');
const router = express.Router();

// CREATE student
router.post('/', async (req, res) => {
    try {
        const student = new Student(req.body);
        const saved = await student.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET student by ID
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Not found' });

        res.json(student);
    } catch {
        res.status(400).json({ error: 'Invalid ID' });
    }
});

module.exports = router;