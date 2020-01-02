import React from 'react'
import {reactLocalStorage} from 'reactjs-localstorage';
const nophoto = require('../../assets/img/nophoto.jpg')

const Navbar = (props) => {
  const data = reactLocalStorage.getObject("data")
  
  return (
    <div style={{ height: "64px", background: "#35a24e", color: "white", textAlign: "center" }}>

      <div style={{float: 'right'}}>
      <div style={{display: 'inline',float: 'left',  border: '1px solid transparent', borderRadius: "50px", overflow: 'hidden', marginTop: "3px"}}>
        {
        data.employeeImage ? <img alt="" style={{right: "20px", height: "57px", width: '64px'}} src={`http://192.168.100.50:3333/uploads/${data.employeeImage}`} /> :
        <img style={{right: "20px", height: "57px", width: '64px'}} src={nophoto} alt=""></img>
        }
      </div>
      <div style={{float: 'left',marginLeft: '12px', padding: '7px'}}>
      <h6>{data.employeeName}</h6>
        <p style={{color: "#adff00", textAlign: 'left'}}>{data.designation}</p>
      </div>
      </div>
    </div>
  )
}



export default Navbar