
import React, { useEffect, useState }  from 'react'
import { Link } from 'react-router-dom'
import '../App.css';
import axios from 'axios';
function Expense_data() {
 

  const token=localStorage.getItem('token');
  const head={
        headers:{
            'Authorization':token
        }
    } 

    const [data, setData]=useState([]);
   useEffect(() =>{
    axios.post('http://localhost:4000/user/daily-expense', head)
    .then(res =>{
        setData(res.data);
    }).catch(err =>console.log(err));

}, []);

   const getDaily=(e) =>{
     e.preventDefault();
       console.log(data);
return data.map(user =>{
return <div>
      <tr class="row">
        <td>{user.Category}</td>
        <td><h5>{user.Description}</h5></td>
        <td>{user.MoneySpent}</td>
        </tr>
        </div>
})
    }

    var total=0;
    const [dataW, setDataW]=useState([]);
    useEffect(() =>{
     axios.post('http://localhost:4000/user/weekly-expense', head)
     .then(res =>{
         setDataW(res.data);
     }).catch(err =>console.log(err));
 
 }, []);
 
    const getWeekly=(e) =>{
      e.preventDefault();
        console.log(dataM);
 return dataW.map(user =>{
   total=total+user.MoneySpent;
 return <div>
       <tr className="row">
         <td>{user.Category}</td>
         <td>{user.MoneySpent}</td>
         </tr>
         </div>
 })
     }


     const [dataM, setDataM]=useState([]);
     useEffect(() =>{
      axios.post('http://localhost:4000/user/monthly-expense', head)
      .then(res =>{
          setDataM(res.data);
      }).catch(err =>console.log(err));
  
  }, []);
  
     const getMonthly=(e) =>{
       e.preventDefault();
         console.log(dataM);
  return dataM.map(user =>{
    total=total+user.MoneySpent;
  return <div>
        <tr className="row">
          <td>{user.Category}</td>
          <td>{user.MoneySpent}</td>
          </tr>
          </div>
  })
      }



function DownloadBtn (e) {
e.preventDefault();
  const a=document.createElement('a');
  axios.post('http://localhost:4000/download', head)
  .then(res =>{
      a.setAttribute('href',`${res.data.fileUrl}`);
a.setAttribute('target','_blank');

a.click();
a.remove();
  }).catch(err =>console.log(err))

}

function prevDownload (e) {

  const div=document.getElementById('day-to-day-expenses')
  div.innerText='';
  const table=document.createElement('table');
  table.className="table";
  table.id="D_table";
  const row=document.createElement('tr');
  row.className="row";
  row.innerHTML=`<th>previous files</th><th>downloaded On</th>`;
  table.appendChild(row);
  axios.post('http://localhost:4000/user/prev-files',head)
  .then(res =>{ console.log(res);
      for(var i=0;i<res.data.length;i++)
      {
      const inner_row=document.createElement('tr');
     inner_row.className="row";
      inner_row.innerHTML=`<td><a href=${res.data[i].fileUrl}>download${i+1}</td><td>${res.data[i].createdAt}</td>`;
      table.appendChild(inner_row);
      }
      div.appendChild(table);
  }).catch(err => console.log(err));
}


  return (
    <body>
    <header className="header">
        <h4>DAY TO DAY EXPENSES</h4>
    </header>
    <div className="D_button" id="f_div">
        <button onClick={prevDownload} id="prev">see previous files</button>
        <button onClick={DownloadBtn} id="btn">download</button>
     </div>

    <div className="duration" id="duration">
       <button onClick={getDaily} id="daily">Daily</button>
        <button onClick={getWeekly} id="weekly">weekly</button>
        <button onClick={getMonthly} id="monthly">Monthly</button>
    </div>
    <div>
  <table className="table" id="D_table">
    <tr className="row">
      <th>Category</th>
      <th>expense</th>
      </tr>
      <div id="day-to-day-expenses" >
        <div>
          <tr className="row"> 
        <td><h5>total</h5></td>
        <td>{total}</td>
        </tr>
        </div>
</div>
      </table>
      </div>
    </body>
  );
}

export default  Expense_data;
