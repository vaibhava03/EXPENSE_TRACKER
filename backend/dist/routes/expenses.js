"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expenses');
router.post('/user/expense', ExpenseController.postExpenses);
router.post('/user/pay', ExpenseController.postPay);
router.get('/user/leaderboard', ExpenseController.getLeaderBoard);
router.get('/user/periodical-expenses', ExpenseController.getPeriodicalExpenses);
router.get('/download', ExpenseController.getExpensesD);
router.get('/user/prev-files', ExpenseController.getPrevFiles);
exports.default = router;

