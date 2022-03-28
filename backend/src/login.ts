import path from 'path';
import User from '../models/user';
import FPReq from '../models/ForgotPasswordRequests';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// import { env } from './environment/environment';
import sgMail from '@sendgrid/mail';
import { v4 as uuidv4 } from 'uuid';
import {Request, Response, NextFunction} from "express";

const saltRounds=10;
   sgMail.setApiKey(process.env.SENDGRID_API_KEY as string )


const  postSignup= (req: Request, res:Response) =>{
    User.findOne({where:{email:req.body.email }})
    .then((user: any) =>{
       if(!user){
        bcrypt.hash(req.body.password, saltRounds, (err, hash) =>{
        User.create({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        password:hash
        })
        })
        res.sendStatus(201);
     }
     else 
      res.sendStatus(208);
    })
    .catch((err: any) => console.log(err));
};

const postLogin= (req: Request, res:Response) =>{
 User.findOne({where:{email:req.body.email}})
 .then((user: { password: string; id: any; }) =>{
     if(!user)
     {
        res.sendStatus(404);
     }
     else{
    bcrypt.compare(req.body.password, user.password, function(err, response) {
    
    if (err) {
          console.log(err);
    } 
    else if(!response)
    {
        res.sendStatus(401)

    }
    else {
        var token=jwt.sign({id:user.id}, "secret");
        res.json(token);
        console.log(token);
       }
    })
}
})
};

const postForgetPassword=(req: Request, res:Response) =>{
    User.findOne({where:{email:req.body.email}})
    .then((user: { createFPReq: (arg0: { id: string; isActive: boolean; }) => void; }) =>{
       const FP_id=uuidv4();
       user.createFPReq({id:FP_id,isActive:true});
    const msg={
       to:req.body.email,
       from:"vaibhavavarikilla@gmail.com",
       subject:"create new password",
       text: "hi we received a reset password request",
       html:`<strong>click the link to reset password</strong><a href=http://localhost:3000/password/resetpassword/${FP_id}>click here</a>`
    }
    sgMail.send(msg)
    .then((response) =>{
       // console.log(response);
    })
    })
};
    
const useResetPassword=(req: Request, res:Response) =>{
        FPReq.findOne({where:{id:req.params.passwordId}})
        .then((data: { isActive: any; update: (arg0: { isActive: boolean; }) => void; }) =>{
           if(data&&data.isActive){
     
          res.status(200).send(`<html>
        
          <form action="/updatepassword/${req.params.passwordId}" method="GET">
          <label for="password">Enter a new password</label>
          <input type="password" name="password">
          <button type="submit">SUBMIT</button>
          </form>
       
          </html>`);
          console.log(req.body);
          data.update({ isActive: false});
          res.end()
     
           }
           else console.log(res.status);
        })
        .catch((err: any) => console.log(err));
       
        // res.redirect('/updatepassword/${req.body}')
};
     
const useUpdatePassword= (req: Request, res:Response) =>{

     const password=req.query.password as string;
     const Id=req.params.resetpasswordid;
     FPReq.findOne({where:{id:Id}})
     .then((Frequest: { userId: any; }) =>{
        if(Frequest)
        {
           console.log(Frequest.userId)
           User.findOne({where:{id:Frequest.userId}})
           .then((user: { update: (arg0: { password: Error | undefined; }) => void; }) =>{
            return bcrypt.hash(password, saltRounds, ( hash => {
                 user.update({
                    password: hash
                 });
              }));
            });
        return res.status(404).json('No user Exists');
        }
    }).catch((err: any) => {
       console.log(err);
        return res.status(403);
     })
};

module.exports= {
   postSignup,
   postLogin,
   postForgetPassword,
   useResetPassword,
   useUpdatePassword
}