import React, { useState, useEffect } from 'react';
import './App.css';
// import Navbar from './features/Common/Navbar';
import Routing from './features/Common/Routing';
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import { withRouter } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import Sidebar from '../src/features/Home/component/sidebar'
import Navbar from '../src/features/Common/Navbar'
import '@progress/kendo-theme-default/dist/all.css';

function App(props) {
  const app = reactLocalStorage.getObject('data');  

  return (
    <div className="container-fluid p-0 m-0 d-flex flex-column">
      {app.token && props.history.location.pathname.replace('/', '') ? <Sidebar props={props} /> : ''}
      {app.token && props.history.location.pathname.replace('/', '') ? <Navbar /> : ''}
      <Routing />
    </div>
  );
}

export default withRouter(App);
