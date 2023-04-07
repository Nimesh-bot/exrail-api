const Income = require('../models/Income');

const getAllIncomes = async (req, res, next) => {
    try {
        const incomes = await Income.find({ user: req.user.aud });
        res.status(200).json({
            message: 'All incomes fetched successfully',
            incomes
        })
    }
    catch(err) {
        next(err);
    }
}
const getUsersIncome = async (req, res, next) => {
    try {
        const income = await Income.find({ user: req.user.aud });
        res.status(200).json({
            message: 'Income fetched successfully',
            income
        })
    }
    catch(err) {
        next(err);
    }
}
const getIncome = async (req, res, next) => {
    try {
        const income = await Income.findById(req.params.id);
        if(req.user.aud !== income.user) throw new Error('Unauthorized access');
        res.status(200).json({
            message: 'Income fetched successfully',
            income
        })
    }
    catch(err) {
        next(err);
    }
}

const updateIncome = async (req, res, next) => {
    try {
        const income = await Income.findOne({ user: req.user.aud });
        if(req.user.aud !== income.user.toString()) throw new Error('Unauthorized access');
        const updatedIncome = await Income.findOneAndUpdate({ user: req.user.aud }, req.body, {
            new: true,
        });
        res.status(200).json({
            message: 'Income updated successfully',
            updatedIncome
        })
    }
    catch(err) {
        next(err);
    }
}

const deleteIncome = async (req, res, next) => {
    try {
        const income = await Income.findById(req.params.id);
        if(req.user.aud !== income.user) throw new Error('Unauthorized access');
        await Income.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: 'Income deleted successfully'
        })
    }
    catch(err) {
        next(err);
    }
}

module.exports = {
    getAllIncomes, getUsersIncome, getIncome, updateIncome, deleteIncome
}