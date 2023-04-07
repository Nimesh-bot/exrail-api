const express = require('express');

const expensesController = require('../controllers/expenses.cont');
const { verify_user } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
    .get(verify_user, expensesController.getExpense)
    .post(verify_user, expensesController.postExpense)
    .put((req, res) => res.status(405).json({ message: 'Method not allowed' }))
    .delete((req, res) => res.status(405).json({ message: 'Method not allowed' }))

router.route('/defexpense')
    .get(verify_user, expensesController.defExpense)
    .post((req, res) => { res.status(405).json({ message: 'Method not allowed' }) })
    .put((req, res) => { res.status(405).json({ message: 'Method not allowed' }) })
    .delete((req, res) => { res.status(405).json({ message: 'Method not allowed' }) })

router.route('/:id')
    .get(verify_user, expensesController.getExpenseById)
    .post((req, res) => { res.status(405).json({ message: 'Method not allowed' }) })
    .put(verify_user, expensesController.updateExpense)
    .delete(verify_user, expensesController.deleteExpense)

router.put('/estimated/:id', verify_user, expensesController.updateEstimatedExpense)
router.get('/yearly', verify_user, expensesController.getExpensesOfThisYear)

module.exports = router;