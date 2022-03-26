import React from 'react';
const Posts=({posts}) =>{
  var i=1; 
        return posts.map(element =>{
        return <tr key={i++}>
          <td><div>{element.week}</div><div>{element.Date}.{element.Month}</div></td>
        <td>{element.Category}</td>
        <td>{element.description}</td>
        <td>{element.MoneySpent}</td>
        </tr>
        })
        }
export default Posts