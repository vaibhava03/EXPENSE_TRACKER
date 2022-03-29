"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const ForgotPasswordRequests_1 = __importDefault(require("../models/ForgotPasswordRequests"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const uuid_1 = require("uuid");
const saltRounds = 10;
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const postSignup = (req, res) => {
    user_1.default.findOne({ where: { email: req.body.email } })
        .then((user) => {
        if (!user) {
            bcrypt_1.default.hash(req.body.password, saltRounds, (err, hash) => {
                user_1.default.create({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hash
                });
            });
            res.sendStatus(201);
        }
        else
            res.sendStatus(208);
    })
        .catch((err) => console.log(err));
};
const postLogin = (req, res) => {
    user_1.default.findOne({ where: { email: req.body.email } })
        .then((user) => {
        if (!user) {
            res.sendStatus(404);
        }
        else {
            bcrypt_1.default.compare(req.body.password, user.password, function (err, response) {
                if (err) {
                    console.log(err);
                }
                else if (!response) {
                    res.sendStatus(401);
                }
                else {
                    var token = jsonwebtoken_1.default.sign({ id: user.id }, "secret");
                    res.json(token);
                    console.log(token);
                }
            });
        }
    });
};
const postForgetPassword = (req, res) => {
    user_1.default.findOne({ where: { email: req.body.email } })
        .then((user) => {
        const FP_id = (0, uuid_1.v4)();
        user.createFPReq({ id: FP_id, isActive: true });
        const msg = {
            to: req.body.email,
            from: "vaibhavavarikilla@gmail.com",
            subject: "create new password",
            text: "hi we received a reset password request",
            html: `<strong>click the link to reset password</strong><a href=http://localhost:3000/password/resetpassword/${FP_id}>click here</a>`
        };
        mail_1.default.send(msg)
            .then((response) => {
            // console.log(response);
        });
    });
};
const useResetPassword = (req, res) => {
    ForgotPasswordRequests_1.default.findOne({ where: { id: req.params.passwordId } })
        .then((data) => {
        if (data && data.isActive) {
            res.status(200).send(`<html>
        
          <form action="/updatepassword/${req.params.passwordId}" method="GET">
          <label for="password">Enter a new password</label>
          <input type="password" name="password">
          <button type="submit">SUBMIT</button>
          </form>
       
          </html>`);
            console.log(req.body);
            data.update({ isActive: false });
            res.end();
        }
        else
            console.log(res.status);
    })
        .catch((err) => console.log(err));
    // res.redirect('/updatepassword/${req.body}')
};
const useUpdatePassword = (req, res) => {
    const password = req.query.password;
    const Id = req.params.resetpasswordid;
    ForgotPasswordRequests_1.default.findOne({ where: { id: Id } })
        .then((Frequest) => {
        if (Frequest) {
            console.log(Frequest.userId);
            user_1.default.findOne({ where: { id: Frequest.userId } })
                .then((user) => {
                return bcrypt_1.default.hash(password, saltRounds, (hash => {
                    user.update({
                        password: hash
                    });
                }));
            });
            return res.status(404).json('No user Exists');
        }
    }).catch((err) => {
        console.log(err);
        return res.status(403);
    });
};
module.exports = {
    postSignup,
    postLogin,
    postForgetPassword,
    useResetPassword,
    useUpdatePassword
};
