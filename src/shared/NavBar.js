import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar'
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal"
import logo from '../images/quantum-health-logo.svg';
import '../index.css';
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";

function QHNavBar(props) {

	const {clientsConfig, loading, updateConfig, currentConfigs,
		setIsLoading, updateWorkloads} = props;

	const [showSaveStatus, setShowSaveStatus] = useState(false);
	const [showConfigNamePop, setShowConfigNamePop] = useState(false);
	const [saveStatusMessage, setSaveStatusMessage] = useState();

	const [showLoadStatus, setShowLoadStatus] = useState(false);
	const [loadStatusMessage, setLoadMessage] = useState();

	const configNameRef = React.createRef();

	const saveSucceedMessage = "Succeed! The clients configuration has been saved!";
	const saveFailedMessage = "Failed! The configuration was not saved. ";
	const loadSucceedMessage = "Succeed! The clients configuration has been loaded to the application.";
	const loadFailedMessage = "Failed! The configuration was not loaded. ";

	let btnPadding = {
		marginRight: "0.7rem",
		backgroundColor: "#84BD00",
		border: "0px"
	};

	async function saveConfig() {
		const config = {
			"name": configNameRef.current.value,
			"config": clientsConfig
		};
		fetch("http://localhost:5000/save_config", {     // TODO: change to deployment server address
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(config)
		}).then(response => {
			return response.json();
		}).then((data)=>{
			setSaveStatusMessage(saveSucceedMessage);
			handleConfigNameHide();
			setShowSaveStatus(true);
		}).catch(error => {
			setSaveStatusMessage(saveFailedMessage + error.toString());
			handleConfigNameHide();
			setShowSaveStatus(true);
		});
	}

	async function loadConfig(selectedName) {
		setIsLoading(true);
		fetch("http://localhost:5000/load_config?name=" + selectedName)    // TODO: change to deployment server address
			.then(response => response.json())
			.then(config => {
				fetch("http://localhost:5000/workload?name=" + selectedName)     // TODO: change to deployment server address
					.then(response => response.json())
					.then(workloads => {
						updateConfig(config);
						updateWorkloads(workloads);
						setIsLoading(false);
						setLoadMessage(loadSucceedMessage);
						setShowLoadStatus(true);})
					.catch(error => {
						setSaveStatusMessage(loadFailedMessage + error.toString());
						setShowLoadStatus(true);
					});})
			.catch(error => {
				setSaveStatusMessage(loadFailedMessage + error.toString());
				setShowLoadStatus(true);
		});
	}

	function handleConfigNameShow() { setShowConfigNamePop(true); }

	function handleConfigNameHide() { setShowConfigNamePop(false); }

	function handleSaveStatusHide() { setShowSaveStatus(false); }

	function handleLoadStatusHide() { setShowLoadStatus(false); }


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
				{/*Save Function*/}
				<Button style={btnPadding} disabled={loading} onClick={handleConfigNameShow}>Save</Button>
				{/* Configuration name input popup window */}
				<Modal show={showConfigNamePop} onHide={handleConfigNameHide}>
					<Modal.Header><h4><small>Create New Configuration</small></h4></Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group controlId={"configName"}>
							<FormControl placeholder={"New Configuration Name"}
							             type={"text"}
							             ref={configNameRef}
							/>
							</Form.Group>
						</Form>
						<Button style={btnPadding} onClick={saveConfig} className={"float-right"}>Submit</Button>
					</Modal.Body>
				</Modal>
				{/* Save operation status popup window */}
				<Modal show={showSaveStatus} onHide={handleSaveStatusHide}>
					<Modal.Body>
						<h5><small>{saveStatusMessage}</small></h5>
					</Modal.Body>
					<Modal.Footer>
						<Button variant={"secondary"} onClick={handleSaveStatusHide}>Close</Button>
					</Modal.Footer>
				</Modal>

				{/*Load Function*/}
				<Dropdown>
					<Dropdown.Toggle disabled={loading} style={btnPadding} id={"loadDropdown"}>Load</Dropdown.Toggle>
					<Dropdown.Menu>
						{ loading ?
							<Dropdown.Item>Loading</Dropdown.Item>  :
							currentConfigs.map(config => {
								return (
									<Dropdown.Item key={config}
										onClick={() => loadConfig(config)}>
										{config}
									</Dropdown.Item>
								);})
						}
					</Dropdown.Menu>
				</Dropdown>

				{/* load operation status popup window */}
				<Modal show={showLoadStatus} onHide={handleLoadStatusHide}>
					<Modal.Body>
						<h5><small>{loadStatusMessage}</small></h5>
					</Modal.Body>
					<Modal.Footer>
						<Button variant={"secondary"} onClick={handleLoadStatusHide}>Close</Button>
					</Modal.Footer>
				</Modal>

				{/*Revert Function*/}
				<Button style={btnPadding}>Revert</Button>

			</Navbar.Collapse>
		</Navbar>
	);
}

export default QHNavBar;