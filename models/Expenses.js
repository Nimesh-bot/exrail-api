const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
    {
        food: {
            type: Number,
            default: 0
        },
        estimated_food: {
            type: Number,
            default: 0
        },
        transport: {
            type: Number,
            default: 0
        },
        estimated_transport: {
            type: Number,
            default: 0
        },
        expected: {
            type: Number,
            default: 0
        },
        estimated_expected: {
            type: Number,
            default: 0
        },
        uncertain: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Expense must be separated for a user']
        },
        year: {
            type: Number,
        },
        month: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Expense', expenseSchema);