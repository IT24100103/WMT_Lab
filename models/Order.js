const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
            quantity: Number
        }
    ],
    totalPrice: Number,
    status: {
        type: String,
        enum: ['PLACED', 'PREPARING', 'DELIVERED', 'CANCELLED'],
        default: 'PLACED'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);