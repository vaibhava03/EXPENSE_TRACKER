"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../util/database"));
const User = database_1.default.define('user', {
    id: {
        type: sequelize_1.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: sequelize_1.STRING,
    email: {
        type: sequelize_1.STRING,
        unique: true
    },
    phone: {
        type: sequelize_1.STRING,
        unique: true
    },
    password: sequelize_1.STRING
});
exports.default = User;
