"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, 'util/.env') });
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = __importDefault(require("./util/database"));
const user_1 = __importDefault(require("./models/user"));
const expense_1 = __importDefault(require("./models/expense"));
const order_1 = __importDefault(require("./models/order"));
const ForgotPasswordRequests_1 = __importDefault(require("./models/ForgotPasswordRequests"));
const FileUrl_1 = __importDefault(require("./models/FileUrl"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, 'access.log'), { flags: 'a' });
app.use((0, morgan_1.default)('combined', { stream: accessLogStream }));
const login_1 = __importDefault(require("./routes/login"));
const expenses_1 = __importDefault(require("./routes/expenses"));
app.use(login_1.default);
app.use(expenses_1.default);
user_1.default.hasMany(expense_1.default);
expense_1.default.belongsTo(user_1.default);
user_1.default.hasMany(order_1.default);
order_1.default.belongsTo(user_1.default);
user_1.default.hasMany(ForgotPasswordRequests_1.default);
ForgotPasswordRequests_1.default.belongsTo(user_1.default);
user_1.default.hasMany(FileUrl_1.default);
FileUrl_1.default.belongsTo(user_1.default);
database_1.default
    .sync()
    .then(() => {
}).catch(function (Error) {
    console.log('ERROR:', Error);
});
app.listen(4000);
