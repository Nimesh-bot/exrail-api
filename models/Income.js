const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
    {
        monthlySalary: {
            type: Number,
            default: 0,
        },
        estimatedSaving: {
            type: Number,
            required: [true, 'Please enter the amount you expect to save'],
        },
        receiveDate: {
            type: String,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Income must be separated for a user'],
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
)

module.exports = mongoose.model('Income', incomeSchema);