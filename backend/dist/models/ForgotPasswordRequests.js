"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../util/database"));
const ForgetPassWordRequests = database_1.default.define('FPReq', {
    id: {
        type: sequelize_1.default.STRING,
        primaryKey: true,
        allowNull: false
    },
    isActive: sequelize_1.default.BOOLEAN
});
exports.default = ForgetPassWordRequests;
