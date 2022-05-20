import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css';
import axios from 'axios';

function Razorpay() {

function PayBtn(e){     
  e.preventDefault();
  const token=localStorage.getItem('token');

  const ord={
  amount:120
  }
  const head={
  headers:{
  'Authorization':token
  }
  }
  axios.post('http://3.87.125.143/user/pay', ord, head)
  .then()
  .catch(err => console.log(err));
  setTimeout(()=>{
  axios.get('http://localhost:4000/user/pay')
  .then(res =>{
  console.log(res);
  localStorage.setItem('orderId',res.data.orderId);
  if(res.status===200){
  document.body.innerHTML= document.body.innerHTML+'<h4>payment successfull</h4><a href="/expenses">go back</a>';
  }
  })
  .catch(err =>{
  document.body.innerHTML= document.body.innerHTML+'<h4>Transaction failed</h4><a href="/razorpay">Try Again</a>';
  console.log(err);
  })
},1000);

}
  return (
    <body class="body">
    <h4> click the button to pay the amount of RS.120\- </h4>
    <button onClick={PayBtn} id="pay">PROCEED & PAY</button>
    </body>
  );
}

export default Razorpay;
