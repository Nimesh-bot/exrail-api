const Expenses = require('../models/Expenses');

const getAllExpenses = async (req, res, next) => {
    try {
        const expenses = await Expenses.find();
        res.status(200).json({
            message: 'Expenses fetched successfully',
            expenses
        })
    }
    catch(err) {
        next(err);
    }
}

const getExpense = async (req, res, next) => {
    try {
        const expenses = await Expenses.find({ user: req.user.aud });
        res.status(200).json({
            message: 'Expenses fetched successfully',
            expenses
        })
    }
    catch(err) {
        next(err);
    }
}

const defExpense = async (req, res, next) => {
    const d = new Date()

    try {
        const expense = await Expenses.find({ user: req.user.aud, year: d.getFullYear(), month:d.getMonth()+1 });
        res.status(200).json({
            message: 'Expense fetched successfully',
            expense
        })
    }
    catch(err) {
        next(err);
    }
}

const getExpensesOfThisYear = async (req, res, next) => {
    const d = new Date()

    try {
        const expenses = await Expenses.find({ user: req.user.aud, year: d.getFullYear()});
        res.status(200).json({
            message: 'Expenses fetched successfully',
            expenses
        })
    }
    catch(err) {
        next(err);
    }
}
    
    
const getExpenseById = async (req, res, next) => {
    try {
        const expense = await Expenses.findById(req.params.id);
        if(req.user.aud !== expense.user) throw new Error('Unauthorized access');
        res.status(200).json({
            message: 'Expense fetched successfully',
            expense
        })
    }
    catch(err) {
        next(err);
    }
}

const postExpense = async (req, res, next) => {
    try {
        const expense = new Expenses(req.body);
        expense.year = new Date().getFullYear();
        expense.month = new Date().getMonth() + 1;
        expense.user = req.user.aud;

        await expense.save();

        res.status(201).json({
            message: 'Expense created successfully',
            expense
        })
    }
    catch(err) {
        next(err);
    }
}

const updateExpense = async (req, res, next) => {
    try {
        const expense = await Expenses.findById(req.params.id);
        if(req.user.aud !== (expense.user).toString()) throw new Error('Unauthorized access');
        const updatedExpense = await Expenses.findById(req.params.id);
        updatedExpense.food += req.body.food;
        updatedExpense.transport += req.body.transport;
        updatedExpense.expected += req.body.expected;
        updatedExpense.uncertain += req.body.uncertain;

        await updatedExpense.save();

        res.status(200).json({
            message: 'Expense updated successfully',
            updatedExpense
        })
    }
    catch(err) {
        next(err);
    }
}

const updateEstimatedExpense = async (req, res, next) => {
    try {
        const expense = await Expenses.findById(req.params.id);
        if(req.user.aud !== (expense.user).toString()) throw new Error('Unauthorized access');
        const updatedExpense = await Expenses.findById(req.params.id);
        updatedExpense.estimated_food = req.body.estimated_food;
        updatedExpense.estimated_transport = req.body.estimated_transport;
        updatedExpense.estimated_expected = req.body.estimated_expected;

        await updatedExpense.save();

        res.status(200).json({
            message: 'Expense updated successfully',
            expense
        })
    }
    catch(err) {
        next(err);
    }
}

const deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expenses.findById(req.params.id);
        if(req.user.aud !== expense.user) throw new Error('Unauthorized access');
        await Expenses.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: 'Expense deleted successfully'
        })
    }
    catch(err) {
        next(err);
    }
}

module.exports = {
    postExpense, updateExpense, updateEstimatedExpense, deleteExpense, getAllExpenses, getExpense, getExpenseById, defExpense, getExpensesOfThisYear
}