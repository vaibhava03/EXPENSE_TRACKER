"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../util/database"));
const Expense = database_1.default.define('expense', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    MoneySpent: sequelize_1.default.DOUBLE,
    Description: sequelize_1.default.STRING,
    Category: sequelize_1.default.STRING
});
exports.default = Expense;
