import React, { useEffect, useState }  from 'react'
import { Link } from 'react-router-dom'
import '../App.css';
import axios from 'axios';


function Expenses() {
   function expenseSubmit(e) {
       e.preventDefault();
       const money=document.getElementById("Mspent").value;
       const description=document.getElementById("description").value;
       const category=document.getElementById("category").value;
       const token=localStorage.getItem('token');
        const myObj={
          money:money,
          description:description,
          category:category 
      }
      const head={
          headers:{
              'Authorization':token
          }
      }
      console.log(myObj);
       axios.post("http://localhost:4000/user/expense", myObj, head)
       .then(res =>{
           console.log(res);
       })
       .catch(err => console.log(err));
    }
    function premiumBuy(e){
        const a=document.createElement('a');
                a.href="/razorpay";
                a.target='_blank';
                document.body.appendChild(a);
                a.click();
                a.remove();
    }

function checkExpense(e){
e.preventDefault();
if(e.target.nextElementSibling.className==="HExpense")
{
 const HExpense=e.target.nextElementSibling;
 HExpense.style.display="block";
}
}
function removeExpense(e){
    e.preventDefault();
    if(e.target.nextElementSibling.className==="HExpense")
    {
     const HExpense=e.target.nextElementSibling;
     HExpense.style.display="none";
    }
}
const [data, setData]=useState([]);
   useEffect(() =>{
        axios.get('http://localhost:4000/user/leaderboard')
    .then(res =>{
        setData(res.data);
    }).catch(err =>console.log(err));

}, []);

   const getLB=() =>{
       console.log(data);
       var i=1;
return data.map(user =>{
   
return <li><div onClick={checkExpense} onDoubleClick={removeExpense} >
<h4 className="user">{i++}){user.userName}</h4>
<div className="HExpense" >
    <h2>expenses={user.expenses}</h2>
    </div>
    </div></li>
    
})
    }



  return (
    <div className="body">
    <header className="header">
        <h2>Expense Tracker Application</h2>
        </header>
        <div id="divv">
        <section id='sectionId' ><div className="leaderB"><h3>LeaderBoard</h3><ul>{getLB()}</ul></div></section>
             <section className="sec2">
                 <div className="premium_div">
            <div className="PText">
            <h4>Premium Membership</h4>
        </div>
        <ul>
          <li>get dark theme</li>
          </ul>
            <button onClick={premiumBuy} className="premiumBtn" id="premiumBtn">BUY NOW</button>
        </div>
    <div className="div2">
        <h3>Daily Expenses</h3>
    <form onSubmit={expenseSubmit} id="expenseForm">
        <label for="Mspent" >Money Spent</label><br />
        <input type="number" id="Mspent" name="Mspent" /><br />
        <label for="description">Description of Expense</label><br />
        <textarea id="description" name="descrpition" ></textarea><br />      
        <label for="category">Select Category</label>
        <select name="category" id="category">
            <option value="food">Food</option>
            <option value="health">Health</option>
            <option value="transport">Transport</option>
            <option value="utilities">Utilities</option>
            <option value="insurance">Insurance</option>
            <option value="clothing">Clothing</option>
            <option value="others">Others</option>
        </select>
        <input type="submit" id='submit'value="ADD EXPENSES" /> 
    </form>
</div>
</section>
<section className="data">
    
    <Link to="/expense-data" ><h4>See Expenses</h4></Link>
</section>
</div>

</div>
  );
}


export default Expenses;
 