import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import App from './App';
import Signup from './components/Signup'
import Login from './components/Login'
import ForgetPass from './components/ForgetPass'
import Expenses from './components/Expenses'
import Expense_data from './components/Expense-data'
import Razorpay from './components/Razorpay'
ReactDOM.render(
     <Router>
           
    <Routes>
        <Route path="/" element={ <App/>  } ></Route>
        <Route path="/signup" element={ <Signup/>  } ></Route>
        <Route path="/login" element={ <Login/> } > </Route>
        <Route path="/razorpay" element={ <Razorpay/> } ></Route>
        <Route path="/forget-password" element={ <ForgetPass/> } ></Route>
        <Route path="/expense-data" element={ <Expense_data/> } ></Route>
        <Route path="/expenses" element={ <Expenses/> } ></Route>

    </Routes>

</Router>, 
document.getElementById('root')
);
