const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    faculty: String,
    year: { type: Number, min: 1, max: 4 }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);