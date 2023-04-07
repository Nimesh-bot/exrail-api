const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: [true, 'Please enter the name of the product you want to buy']
        },
        price: {
            type: Number,
            required: [true, 'Please enter the market price']
        },
        image: {
            type: String,
            // required: [true, 'Please upload an image of the product']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Income must be separated for a user'],
        }
        },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Wish', wishSchema);