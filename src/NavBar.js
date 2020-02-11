import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar'
import Button from "react-bootstrap/Button";
import logo from './quantum-health-logo.svg'
import './index.css'

function QHNavBar() {
    let btnPadding = {
        "margin-right": "0.7rem"
    };
    return (
       <Navbar className='navbar'>
           <Navbar.Brand href="#home">
               <img alt="icon"
                    src={logo}
                    width="140"
                    height="50"
                    className="d-inline-block align-top" /> {' '}
           </Navbar.Brand>
           <Navbar.Collapse className="justify-content-end">
               <Button variant='success' style={btnPadding}>Save</Button>
               <Button variant='success' style={btnPadding}>Revert</Button>
           </Navbar.Collapse>
       </Navbar>
   );
}

export default QHNavBar;