import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar'
import Button from "react-bootstrap/Button";
import logo from '../images/quantum-health-logo.svg';
import '../index.css';

function QHNavBar() {
	let btnPadding = {
		marginRight: "0.7rem",
		backgroundColor: "#84BD00",
		border: "0px"
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
				<Button style={btnPadding}>Save</Button>
				<Button style={btnPadding}>Revert</Button>
			</Navbar.Collapse>
		</Navbar>
	);
}

export default QHNavBar;