
import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css';
import axios from 'axios';
function Login() {
  function handleSubmit(e)
    {
        e.preventDefault();
        const input = document.getElementById("Pwd");
        const emailId = document.getElementById("email").value;
        const password=input.value;
        const myObj = {
        email: emailId,
        password:password
        }
        axios.post('http://3.87.125.143/user/login', myObj)
        .then(res =>{
            console.log(res);
            if(res.status===200){
           localStorage.setItem('token',res.data);
           
                const a=document.createElement('a');
                a.href="/expenses";
                a.target='_blank';
                document.body.appendChild(a);
                a.click();
                a.remove();
            }

        }).catch(err => console.log(err));
       }
  return (
    <body class="body">
    <header class="header">
    <h2>Expense Tracker Application</h2>
    </header>
    <div class="div1">
    <form onSubmit={handleSubmit} id="Form">
     <label for="email">Email:</label><br />
    <input type="email" id="email" /><br />
    <label for="password" id="password">Password:</label><br />
    <input type="password" id="Pwd" /><br />
    <input type="submit" id='submit'value="LOGIN" /> <br />
    </form>
    <div class="sign-up">
    <Link to="/forget-password" id="forgetP">Forget Password?</Link><br />
    <h4>A new user? </h4>
    <Link to="/signup"><h5>Signup Here</h5></Link>
    </div>
    </div>
          </body>
  );
}

export default Login;
