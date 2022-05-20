
import React, { useEffect, useState }  from 'react'
import { Link } from 'react-router-dom'
import '../../App.css';
import axios from 'axios';
import Posts from './Posts'
import Pagination from './Pagination'


 function Expense_data() {
const token=localStorage.getItem('token');

function handleRows (e) {
  console.timeLog(e.target);
}
function DownloadBtn (e) {
  e.preventDefault();
    const a=document.createElement('a');
    axios.get({
      'method':'GET',
      'url':'http://3.87.125.143/download',
      'headers':{
        Authorization:token
      }, 
    }).then(res =>{
      console.log(res.data.fileUrl);
        a.setAttribute('href',`${res.data.fileUrl}`);
  a.setAttribute('target','_blank');
  a.click();
  a.remove();
    }).catch(err =>console.log(err))
  
  }

const[currentPage,setCurrentPage]=useState(1);
const[postsPerPage,setPostsPerPage]=useState(10);



const [data,setData]=useState([]);
var [total,setTotal]=useState(0);

function GetExpense(e){
  
var money=0;
e.preventDefault();
axios({
  'method':'GET',
  'url':'http://localhost:4000/user/periodical-expenses',
  'headers':{
    Authorization:token,
    'dur':e.target.id
    }
}).then(res =>{
  setData(res.data); 
  res.data.map(a =>{
    money=money+a.MoneySpent;
    setTotal(money)
  })
}).catch(err => console.log(err));
}

const indexOfLastPost=currentPage*postsPerPage;
const indexOfFirstPost=indexOfLastPost-postsPerPage;
const currentPosts=data.slice(indexOfFirstPost, indexOfLastPost);

const paginate=(pageNumber) =>setCurrentPage(pageNumber);

const handleSubmit =(e) =>{
  localStorage.setItem('rows',e.target.value);
}
useEffect(() =>{
  setPostsPerPage(localStorage.getItem('rows'));
})
  return (<div>
    <header className="header">
        <h4>DAY TO DAY EXPENSES</h4>
    </header>
    <form>
    <label htmlFor="category">rows per page</label>
    <select name="category" id="rowPP"   onChange={e => handleSubmit(e)}>
            <option value="05">05</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
        </select>


        </form>
    <div className="D_button" id="f_div">
        <Link to="/previous-files"><button  id="prev">see previous files</button></Link>
        <button onClick={DownloadBtn} className="D_button" id="btn">DownloadFile</button>

     </div>
    <div className="duration" id="duration">
       <button onClick={GetExpense} id="daily">Daily</button>
        <button onClick={GetExpense} id="weekly">weekly</button>
        <button  onClick={GetExpense} id="monthly">Monthly</button>
    </div>
    <h4>Total Expenses=Rs.{total}</h4>
    <table>
   <thead>
       <tr>
         <td>Date</td>
       <td>Expense Category</td>
       <td>Description</td>
       <td>Money Spent</td>
       </tr>
   </thead>
   <tbody>{/*{getData()} */}<Posts posts={currentPosts} /></tbody>
</table>
<Pagination postsPerPage={postsPerPage} totalPosts={data.length} paginate={paginate} />
    </div>
  );
}

export default  Expense_data;
