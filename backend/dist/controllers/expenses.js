"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const expense_1 = __importDefault(require("../models/expense"));
const order_1 = __importDefault(require("../models/order"));
const Razorpay = require('razorpay');
const instance = new Razorpay({ key_id: 'rzp_test_PEFKbA3GQ0O6x9', key_secret: process.env.SECRET });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const FileUrl = require('../models/FileUrl');
function parseJwt(token) {
    var base64Payload = token.split('.')[1];
    let payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
}
const postExpenses = (req, res) => {
    let payload = parseJwt(req.headers.authorization);
    user_1.default.findByPk(payload.id)
        .then((user) => {
        if (user) {
            user.createExpense({
                MoneySpent: req.body.money,
                Description: req.body.description,
                Category: req.body.category,
                userId: payload.id
            });
        }
    })
        .catch((err) => console.log(err));
};
const postPay = (req, res) => {
    let payload = parseJwt(req.headers.authorization);
    res.sendStatus(200);
    instance.orders.create({
        "amount": req.body.amount,
        "currency": "INR",
        "receipt": "recp1"
    }, (err, order) => {
        if (!err) {
            user_1.default.findByPk(payload.id)
                .then((user) => {
                user.createOrder({ orderid: order.id });
            });
            exports.getPay = (req, res) => {
                const obj = {
                    "orderId": order.id,
                    "keyId": instance.key_id
                };
                res.json(obj);
            };
        }
        else
            console.log(err);
    });
};
const data = [{ userName: 'user5', expenses: 300 }, { userName: 'user9', expenses: 350 }, { userName: 'user3', expenses: 309 }];
user_1.default.findAll()
    .then((users) => {
    users.forEach(user => {
        const id = user.id;
        order_1.default.findOne({ where: { userId: id } })
            .then((order) => {
            if (order) {
                return expense_1.default.findAll({ where: { userId: id } });
            }
        })
            .then((expenses) => {
            if (expenses) {
                var total = 0;
                expenses.forEach((expense) => {
                    total = total + expense.MoneySpent;
                });
                const myObj = {
                    userName: user.name,
                    expenses: total
                };
                data.push(myObj);
            }
        });
    });
});
const getLeaderBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(data.sort(function (x, y) { return y.expenses - x.expenses; }));
});
const getPeriodicalExpenses = (req, res) => {
    const dur = req.headers.dur;
    let payload = parseJwt(req.headers.authorization);
    expense_1.default.findAll({ where: { userId: payload.id } })
        .then((expenses) => {
        const expense_data = [];
        expenses.forEach((expense) => {
            var nowDate1 = new Date();
            var nowDate2 = new Date();
            var date1 = nowDate2.getFullYear() + '-' + (nowDate2.getMonth() + 1) + '-' + nowDate2.getDate();
            var date2 = nowDate2.getFullYear() + '-' + (nowDate2.getMonth() + 1);
            var createdAt = expense.createdAt;
            var updated2 = expense.updatedAt.getFullYear() + '-' + (expense.updatedAt.getMonth() + 1);
            var updatedDate = expense.updatedAt.getFullYear() + '-' + (expense.updatedAt.getMonth() + 1) + '-' + expense.updatedAt.getDate();
            nowDate1.setDate(nowDate1.getDate() - 6);
            const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const m = expense.createdAt.getMonth();
            let name = month[m];
            const w = expense.createdAt.getDay();
            let day = weekday[w];
            let arr = {
                MoneySpent: expense.MoneySpent,
                Category: expense.Category,
                description: expense.Description,
                Date: expense.createdAt.getDate(),
                Month: name + "," + expense.createdAt.getFullYear(),
                week: day
            };
            console.log(updated2 === date2);
            if (dur === 'daily' && date1 === updatedDate) {
                expense_data.push(arr);
            }
            else if (dur === 'weekly' && createdAt > nowDate1) {
                expense_data.push(arr);
            }
            else if (dur === 'monthly' && updated2 === date2) {
                expense_data.push(arr);
            }
        });
        res.json(expense_data);
    });
};
const getExpensesD = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = parseJwt(req.headers.Authorization);
    const expenses = yield expense_1.default.findAll({ where: { userId: payload.id } });
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expense${payload.id}/${new Date()}.txt`;
    const fileUrl = yield uploadToS3(stringifiedExpenses, filename);
    console.log(fileUrl);
    yield FileUrl.create({ userId: payload.id, fileUrl: fileUrl });
    res.status(200).json({ fileUrl, success: true });
});
function uploadToS3(data, filename) {
    let s3bucket = new aws_sdk_1.default.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_SECRET,
    });
    var params = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: "public-read"
    };
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log("something went wrong", err);
                reject(err);
            }
            else {
                console.log("success", s3response);
                resolve(s3response.Location);
            }
        });
    });
}
const getPrevFiles = (req, res) => {
    let payload = parseJwt(req.headers.authorization);
    const data = [];
    FileUrl.findAll({ where: { userId: payload.id } })
        .then((files) => {
        files.forEach((file) => {
            const updated = file.updatedAt.getDate() + '-' + (file.updatedAt.getMonth() + 1) + '-' + file.updatedAt.getFullYear();
            const arr = {
                fileUrl: file.fileUrl,
                createdAt: updated
            };
            data.push(arr);
        });
        res.json(data);
    });
};
module.exports = {
    postExpenses,
    postPay,
    getPeriodicalExpenses,
    getLeaderBoard,
    getExpensesD,
    getPrevFiles
};
