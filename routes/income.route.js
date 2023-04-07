const express = require('express');

const incomeController = require('../controllers/income.cont');
const { verify_user } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
    .get(verify_user, incomeController.getUsersIncome)
    .post((req, res) => { res.status(200).json({ message: 'Income can only be updated' }) })
    .put(verify_user, incomeController.updateIncome)
    .delete(verify_user, incomeController.deleteIncome)

module.exports = router;