import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css';
import axios from 'axios';
function Signup() {
  function handleSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("Pwd");
    const name=document.getElementById('Name').value;
    const email=document.getElementById('email').value;
    const phoneNumber=document.getElementById('phoneNumber').value;
    const password=input.value;
    const myObj={
      name:name,
      email:email,
      phone:phoneNumber,
      password:password
    }
    console.log(myObj);
    axios.post('http://3.87.125.143/user/signup', myObj)
    .then(res =>{
      console.log(res);
    }).catch(err => console.log(err));
  }

  return (
    <body class="body">
    <header class="header">
        <h2>Expense Tracker Application</h2>
        </header >
        <div class="div1">
        <form onSubmit={handleSubmit} id="Form">
        <label for="UserName" >User Name:</label> <br />  
          <input type="text" id="Name" placeholder="Enter a Username" /><br />
          <label for="email">Email:</label><br />
          <input type="email" id="email" placeholder="Enter Email" /><br />
          <label for="phoneNumber">PhoneNumber:</label><br />
          <input type="tel" id="phoneNumber" pattern="[0-9]{10}" placeholder="Enter 10-Digit Phone Number" /><br />
          <label for="password" id="password">Password:</label><br />
          <input type="password" id="Pwd" placeholder="Enter a Password" /><br />
          <input type="submit" id='submit' value="SIGN UP" /> 
          </form>
          <div class="sign-up">
            <h4>Already User? </h4>
            <Link to="/login"><h5>Login here</h5></Link>
            </div>
        </div>
        </body>
  );
}

export default Signup;
