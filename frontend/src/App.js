import React from 'react'
import { Link } from 'react-router-dom'

import './App.css'


 function App() {
    return (
        <body>
        <div className="home">
       <h1 className="ET">EXPENSE TRACKER APP</h1>
       </div>
       <div className="desc"> Track Your Day-To-Day Expenses here. </div>

       <div className='rem'>
       <h4>New User?</h4>
           <Link to="/signup"><h5>Signup Here</h5></Link>
           <h4>Already A User?</h4>
           <Link to="/login"><h5>Login Here</h5></Link>
       </div>
       </body>
    )
}



export default App;