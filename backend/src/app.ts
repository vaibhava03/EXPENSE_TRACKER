 import path from 'path';
 import fs from 'fs';
   import express from 'express';
   const app=express();
   import dotenv from 'dotenv';
   dotenv.config({ path: path.resolve(__dirname, 'util/.env') })
   import bodyParser from 'body-parser';
   import sequelize from './util/database';
   import User from './models/user';
   import Expense from './models/expense';
   import Order from './models/order';
   import FPReq from './models/ForgotPasswordRequests';
   import FileUrl from './models/FileUrl';
   import cors from 'cors';
   import helmet from 'helmet';
   import morgan from 'morgan';

   app.use(helmet());
   app.use(cors());

   app.use(bodyParser.urlencoded({extended:false}));
   app.use(bodyParser.json());
   const accessLogStream=fs.createWriteStream(path.join(__dirname, 'access.log'), {flags:'a'});
   app.use(morgan('combined', {stream:accessLogStream}));

   import loginRoutes from './routes/login';
   import expensesRoutes from './routes/expenses';

   app.use(loginRoutes);
   app.use(expensesRoutes);
 

   User.hasMany(Expense);
   Expense.belongsTo(User);
   User.hasMany(Order);
   Order.belongsTo(User);
   User.hasMany(FPReq);
   FPReq.belongsTo(User);
   User.hasMany(FileUrl);
   FileUrl.belongsTo(User);
   sequelize
    .sync()
    .then(() =>{
    }).catch(function (Error: any): void {
          console.log('ERROR:', Error);
       });

  

    app.listen(4000);
