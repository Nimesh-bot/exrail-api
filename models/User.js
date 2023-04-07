const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter your full name']
        },
        email: {
            type: String,
            required: true,
            unique: [true, 'Email already exists']
        },
        password: {
            type: String,
            required: [true, 'Please enter your password']
        },
        balance: {
            type: Number,
            default: 0
        },
        disciplineLevel: {
            type: Number,
            default: 5.00
        },
        role: {
            type: String,
            enum: ['user', 'editor', 'admin'],
            default: 'user'
        },
        passResetVerified: {
            type: Boolean,
            default: false
        },
        image:{
            img_url: {
                type: String,
                default: ""
            },
            img_key: {
                type: String,
                default: ""
            }
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema)