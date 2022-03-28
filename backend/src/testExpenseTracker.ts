   import path from 'path';
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
   app.use(cors());
   app.use(bodyParser.urlencoded({extended:false}));
   app.use(bodyParser.json());

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
    }).catch((Error: any)  => {
      console.log('ERROR:', Error.message);
  });

  

    app.listen(4000);
