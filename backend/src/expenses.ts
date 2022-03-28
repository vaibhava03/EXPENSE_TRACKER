import path from 'path';
import User from '../models/user';
import Expense from '../models/expense';
import Order from '../models/order';
// import { env } from './environment/environment';
import Razorpay from 'razorpay';
const instance = new Razorpay({ key_id: 'rzp_test_PEFKbA3GQ0O6x9', key_secret: process.env.SECRET});
import AWS from 'aws-sdk';
import {Request, Response, NextFunction} from "express";
const FileUrl=require('../models/FileUrl');
function parseJwt(token: any) {
    var base64Payload = token.split('.')[1];
    let payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
  }

const postExpenses=(req: Request, res:Response) =>{
    let payload= parseJwt(req.headers.authorization);
    User.findByPk(payload.id)
    .then((user: { createExpense: (arg0: { MoneySpent: any; Description: any; Category: any; userId: any; }) => void; }) =>{
       if(user)
       {
          user.createExpense({
            MoneySpent:req.body.money,
            Description:req.body.description,
            Category:req.body.category,
            userId:payload.id
         });
       }
    })
    .catch((err: any) => console.log(err));
};

const postPay=(req: Request, res:Response)=>{
    let payload= parseJwt(req.headers.authorization);
   res.sendStatus(200);
      instance.orders.create({  
         "amount":req.body.amount,
         "currency":"INR",
         "receipt":"recp1"
      },
      (err: any, order: { id: any; })=>{
      if(!err){
         User.findByPk(payload.id)
         .then((user: { createOrder: (arg0: { orderid: any; }) => void; }) =>{
            user.createOrder({orderid:order.id});
         });
         exports.getPay= (req: any, res: { json: (arg0: { orderId: any; keyId: any; }) => void; }) =>{
            const obj={
            "orderId":order.id,
            "keyId":instance.key_id
            }
         res.json(obj);
      };
      }
         else console.log(err);
      });
   
};

const data=[{userName: 'user5', expenses: 300},{userName: 'user9', expenses: 350},{userName: 'user3', expenses: 309}];
User.findAll()
.then((users: any[]) =>{
   users.forEach(user => {
       const id=user.id;
    Order.findOne({where:{userId:id}})
    .then((order: any) =>{
        if(order) {
            return Expense.findAll({where:{userId:id}});
        }
       })
    .then((expenses: any[]) =>{
        if(expenses){
        var total=0;
       expenses.forEach((expense: { MoneySpent: number; })=> {
        total=total+expense.MoneySpent;
        });
       const myObj={
            userName:user.name,
            expenses:total
        }
        data.push(myObj);
    }
        })
    })
   });

const getLeaderBoard=async(req: Request, res:Response) =>{
    res.json(data.sort(function(x,y){return y.expenses-x.expenses}));
};

const getPeriodicalExpenses=(req: Request, res:Response) =>{
    const dur=req.headers.dur;
   
        let payload= parseJwt(req.headers.authorization);
     Expense.findAll({where:{userId:payload.id}})
    .then((expenses: any[]) =>{
    const expense_data: { MoneySpent: any; Category: any; description: any; Date: any; Month: string; week: string; }[]=[]; 
     expenses.forEach((expense: { updatedAt: { getFullYear: () => number; getMonth: () => number; getDate: () => number; }; createdAt: { getMonth: () => number; getDay: () =>number; getDate: () => number; getFullYear: () => number; }; MoneySpent: any; Category: any; Description: any; }) =>{
        var nowDate1 = new Date(); 
        var nowDate2=new Date();
        var date1 = nowDate2.getFullYear()+'-'+(nowDate2.getMonth()+1)+'-'+nowDate2.getDate();  
        var date2 = nowDate2.getFullYear()+'-'+(nowDate2.getMonth()+1);  
        var createdAt=expense.createdAt;
        var updated2=expense.updatedAt.getFullYear()+'-'+(expense.updatedAt.getMonth()+1);
        var updatedDate=expense.updatedAt.getFullYear()+'-'+(expense.updatedAt.getMonth()+1)+'-'+expense.updatedAt.getDate();
        nowDate1.setDate(nowDate1.getDate() - 6); 
        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const m : number=expense.createdAt.getMonth() as number  ;
        let name = month[m];
        const w :number=expense.createdAt.getDay() as number
        let day = weekday[w];
        let arr={
            MoneySpent:expense.MoneySpent,
            Category:expense.Category,
            description:expense.Description,
            Date:expense.createdAt.getDate(),
            Month:name+","+expense.createdAt.getFullYear(),
            week:day
            }
            console.log(updated2===date2)
        if(dur==='daily'&&date1===updatedDate)
        {
            expense_data.push(arr);

        }
        else if(dur==='weekly'&&createdAt>nowDate1 )
        {
            expense_data.push(arr);

        }
        else if(dur==='monthly'&&updated2===date2)
        {
            expense_data.push(arr);
        }
    })
    res.json(expense_data);  
    }) 
};


const getExpensesD= async(req: Request, res:Response) =>{
    let payload= parseJwt(req.headers.Authorization);
    const expenses=await Expense.findAll({where:{userId:payload.id}})
    
    const stringifiedExpenses=JSON.stringify(expenses);

    const filename=`Expense${payload.id}/${new Date()}.txt`;
    const fileUrl= await uploadToS3(stringifiedExpenses,filename);
    console.log(fileUrl);
    await FileUrl.create({userId:payload.id,fileUrl:fileUrl})
    res.status(200).json({fileUrl, success:true});
}

function uploadToS3(data: string, filename: string){
let s3bucket=new AWS.S3({
    accessKeyId:process.env.IAM_USER_KEY,
    secretAccessKey:process.env.IAM_SECRET,
});
    var params={
        Bucket:process.env.BUCKET_NAME as string,
        Key:filename,
        Body:data, 
        ACL:"public-read"
    };
    return new Promise((resolve, reject) =>{
        s3bucket.upload(params, (err: any, s3response: { Location: unknown; }) =>{
            if(err){
                console.log("something went wrong", err);
                reject(err);
            }
            else {console.log("success",s3response);
             resolve(s3response.Location);
        }
    })
})
    }

const getPrevFiles=(req: Request, res:Response) =>{
    let payload= parseJwt(req.headers.authorization);
    const data: { fileUrl: any; createdAt: string; }[]=[];
    FileUrl.findAll({where:{userId:payload.id}})
    .then((files: any[])=>{
        files.forEach((file: { updatedAt: { getDate: () => string; getMonth: () => number; getFullYear: () => string; }; fileUrl: any; }) => {
            const updated=file.updatedAt.getDate()+'-'+(file.updatedAt.getMonth()+1)+'-'+file.updatedAt.getFullYear();
            const arr={
                fileUrl:file.fileUrl,
                createdAt:updated
            }
            data.push(arr);
        });
        res.json(data);
    })
    }

    module.exports= {
        postExpenses,
        postPay,
        getPeriodicalExpenses,
        getLeaderBoard,
        getExpensesD,
        getPrevFiles
    }