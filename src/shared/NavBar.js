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
import {ButtonGroup, Col} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import clearImage from "../images/clear-24px.svg";

function QHNavBar(props) {

	const {clientsConfig, loading, updateConfig, currentConfigs,
		setIsLoading, updateWorkloads, expRatios, updateExpRatios,
		updateConfigsList, updatePSRWork, updateActivities} = props;

	const [showSaveStatus, setShowSaveStatus] = useState(false);
	const [showConfigNamePop, setShowConfigNamePop] = useState(false);
	const [saveStatusMessage, setSaveStatusMessage] = useState();

	const [showLoadStatus, setShowLoadStatus] = useState(false);
	const [loadStatusMessage, setLoadMessage] = useState();

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showDeleteLastModal, setShowDeleteLastModal] = useState(false);
	const [selectedDelCfg, setSelectedDelCfg]	= useState("");

	const [currentDisplayConfig, setCurrentDisplayConfig] = useState();
	const configNameRef = React.createRef();

	const saveSucceedMessage = "Succeed! The clients configuration has been saved!";
	const saveFailedMessage = "Failed! The configuration was not saved. ";
	const loadSucceedMessage = "Succeed! The clients configuration has been loaded to the application.";
	const loadFailedMessage = "Failed! The configuration was not loaded. ";

	const apiHost = "https://qhpredictiveapi.com:8000";
	// const apiHost = "http://127.0.0.1:5000";
	// const localHost = "http://127.0.0.1:5000";

	function handleConfigNameShow() { setShowConfigNamePop(true); }

	function handleConfigNameHide() { setShowConfigNamePop(false); }

	function handleSaveStatusHide() { setShowSaveStatus(false); }

	function handleLoadStatusHide() { setShowLoadStatus(false); }

	function handleDeleteShow() { setShowDeleteModal(true); }

	function handleDeleteHide() { setShowDeleteModal(false); }

	function handleDeleteLastShow() { setShowDeleteLastModal(true); }

	function handleDeleteLastHide() { setShowDeleteLastModal(false); }

	function saveConfig() {
		const config = {
			"name": configNameRef.current.value,
			"config": clientsConfig,
			"exp_ratios": expRatios,
		};

		const isUpdate = (currentConfigs.includes(config.name));
		fetch(apiHost+ "/config", {
			method: isUpdate ? "PUT" : "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(config)})
			.then(response => {response.json();})
			.then((data) => {
				setSaveStatusMessage(saveSucceedMessage);
				if (!isUpdate) updateConfigsList([...currentConfigs, config.name]);
				handleConfigNameHide();
				setShowSaveStatus(true);})
			.catch(error => {
				setSaveStatusMessage(saveFailedMessage + error.toString());
				handleConfigNameHide();
				setShowSaveStatus(true);
			});
	}

	function loadConfig(selectedName) {
		setIsLoading(true);
		setCurrentDisplayConfig(selectedName);
		fetch(apiHost + "/config?name=" + selectedName)
			.then(response => response.json())
			.then(config => {
				fetch(apiHost + "/workload?name=" + selectedName)
					.then(response => response.json())
					.then(workloads => {
						fetch(apiHost +"/fetch_data?name=" + selectedName)
							.then(response => response.json())
							.then(ratios => {
								fetch(apiHost+ "/psr?name=" + selectedName)
									.then(response => response.json())
									.then(psr => {
										fetch(apiHost + "/activity?name=" + selectedName)
											.then(response => response.json())
											.then(activities => {
												updateConfig(config);
												updateWorkloads(workloads);
												updateExpRatios(ratios);
												updatePSRWork(psr);
												updateActivities(activities);
												setIsLoading(false);
												setLoadMessage(loadSucceedMessage);
												setShowLoadStatus(true);
											})
									})
							
							})
					})
					.catch(error => {
						setSaveStatusMessage(loadFailedMessage + error.toString());
						setShowLoadStatus(true);
					});})
			.catch(error => {
				setSaveStatusMessage(loadFailedMessage + error.toString());
				setShowLoadStatus(true);
		});
	}

	function deleteConfig(configName) {
		setSelectedDelCfg(configName);
		(currentConfigs.length === 1) ? handleDeleteLastShow() : handleDeleteShow();
	}

	function confirmDeletion(configName) {
		fetch(apiHost + "/config?name=" + configName,
			{method: "DELETE"})
			.then(response => response.json())
			.then(data => {
				updateConfigsList(prevList => {
					prevList.splice(prevList.indexOf(configName), 1);
					return [...prevList];
				});
				handleDeleteHide();
				if (configName === currentDisplayConfig) {
					loadConfig(currentConfigs[0]);
				}
			})
			.catch(error => {
				console.log(error.toString());
			});
	}

	return (
		<Navbar className='navbar' sticky="top" bg={"light"}>
			<Navbar.Brand href="#home">
				<img alt="icon"
				     src={logo}
				     width="140"
				     height="50"
				     className="d-inline-block align-top" /> {' '}
			</Navbar.Brand>
			<Navbar.Collapse className="justify-content-end">

				{/*Load Function*/}
				<Dropdown >
					<Dropdown.Toggle disabled={loading} className={"nav-button"}
					                 id={"loadDropdown"}><b>Load</b></Dropdown.Toggle>
					<Dropdown.Menu style={{width: "13rem"}}>
						{ loading ?
							<Dropdown.Item>Loading</Dropdown.Item>  :
							currentConfigs.map(config => {return (
									<Row style={{marginBottom: "0.4rem"}} key={config}>
									<Col md={{span: 1, offset: 1}}
									     onClick={() => deleteConfig(config)}>
										<img alt={"clear_icon"} src={clearImage}
										     className={"clear-button"}/>
									</Col>
									<Col>
										<Dropdown.Item onClick={() => loadConfig(config)}>
											{config}
										</Dropdown.Item>
									</Col>
								</Row>
							);})
						}
					</Dropdown.Menu>
				</Dropdown>

				{/*Save Function*/}
				<Button className={"nav-button"} disabled={loading}
				        onClick={handleConfigNameShow}><b>Save</b></Button>

				{/*Revert Function*/}
				<Button className={"nav-button"} disabled={loading}
				        onClick={() => loadConfig(currentDisplayConfig)}><b>Revert</b></Button>

				{/*Configuration name input popup window*/}
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
						<Button onClick={saveConfig} className={"float-right nav-confirm-button"}>Submit</Button>
					</Modal.Body>
				</Modal>

				{/*Save operation status popup window*/}
				<Modal show={showSaveStatus} onHide={handleSaveStatusHide}>
					<Modal.Body>
						<h5><small>{saveStatusMessage}</small></h5>
					</Modal.Body>
					<Modal.Footer>
						<Button variant={"secondary"} onClick={handleSaveStatusHide}>Close</Button>
					</Modal.Footer>
				</Modal>

				{/*load operation status popup window*/}
				<Modal show={showLoadStatus} onHide={handleLoadStatusHide}>
					<Modal.Body>
						<h5><small>{loadStatusMessage}</small></h5>
					</Modal.Body>
					<Modal.Footer>
						<Button variant={"secondary"} onClick={handleLoadStatusHide}>Close</Button>
					</Modal.Footer>
				</Modal>

				{/*Confirm deletion operation popup window*/}
				<Modal show={showDeleteModal} onHide={handleDeleteHide}>
					<Modal.Header>
						<h4><small>Delete Saved Configuration</small></h4>
					</Modal.Header>
					<Modal.Body>
						<h5><small>Are you sure you want to delete configuration
							<b> {selectedDelCfg}?</b>
						</small></h5>
						</Modal.Body>
					<Modal.Footer>
						<ButtonGroup>
							<Button className={"nav-confirm-button"}
							        onClick={handleDeleteHide}>Cancel</Button>
							<Button className={"nav-confirm-button"}
							        onClick={() => confirmDeletion(selectedDelCfg)}>
								Confirm
							</Button>
						</ButtonGroup>
					</Modal.Footer>
				</Modal>

				{/*Forbidding delete the last one saved popup window*/}
				<Modal show={showDeleteLastModal} onHide={handleDeleteHide}>
					<Modal.Body>
						<h5><small><b>{selectedDelCfg}</b> is the last configuration saved.
							You cannot delete it!</small></h5>
					</Modal.Body>
					<Modal.Footer>
						<Button variant={"secondary"} onClick={handleDeleteLastHide}>Close</Button>
					</Modal.Footer>
				</Modal>

			</Navbar.Collapse>
		</Navbar>
	);
}

export default QHNavBar;