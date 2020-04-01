import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import logo from "../images/quantum-health-logo.svg";
import "../index.css";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import {ButtonGroup, Col, Spinner} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import clearImage from "../images/clear-24px.svg";

function QHNavBar(props) {
  const {
	  clientsConfig,
	  loading,
	  updateConfig,
	  currentConfigs,
	  setIsLoading,
	  updateWorkloads,
	  expRatios,
	  updateExpRatios,
	  updateConfigsList,
	  updatePSRWork,
	  updateActivities,
	  updateCapacity,
	  updateMembers,
	  allInputFTE,
	  setAllInputFTE,
	  allPredictFTE,
	  setAllPredictFTE,
	  cardsRefsMap
  } = props;

	const [showSaveStatus, setShowSaveStatus] = useState(false);
	const [showConfigNamePop, setShowConfigNamePop] = useState(false);
	const [saveStatusMessage, setSaveStatusMessage] = useState();

	const [showLoadStatus, setShowLoadStatus] = useState(false);
	const [loadStatusMessage, setLoadMessage] = useState();

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showDeleteLastModal, setShowDeleteLastModal] = useState(false);
	const [selectedDelCfg, setSelectedDelCfg] = useState("");

	const [currentDisplayConfig, setCurrentDisplayConfig] = useState("Initial Config");
	const configNameRef = React.createRef();

	const [showFilterModal, setShowFilterModal] = useState(false);
	const filterMultiSelectRefs = {};

	const saveSucceedMessage =
		"Succeed! The clients configuration has been saved!";
	const saveFailedMessage = "Failed! The configuration was not saved. ";
	const loadSucceedMessage =
		"Succeed! The clients configuration has been loaded to the application.";
	const loadFailedMessage = "Failed! The configuration was not loaded. ";

	const apiHost = "https://qhpredictiveapi.com:8000";
	// const apiHost = "http://127.0.0.1:5000";
	// const localHost = "http://127.0.0.1:5000";

	function saveConfig() {
		const config = {
			name: configNameRef.current.value,
			config: clientsConfig,
			exp_ratios: expRatios
		};

		const isUpdate = currentConfigs.includes(config.name);
		fetch(apiHost + "/config", {
			method: isUpdate ? "PUT" : "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(config)
		})
			.then(response => {
				response.json();
			})
			.then(data => {
				setSaveStatusMessage(saveSucceedMessage);
				if (!isUpdate) updateConfigsList([...currentConfigs, config.name]);
				setShowConfigNamePop(false);
				setShowSaveStatus(true);
			})
			.catch(error => {
				setSaveStatusMessage(saveFailedMessage + error.toString());
				setShowConfigNamePop(false);
				setShowSaveStatus(true);
			});
	}

	function loadConfig(selectedName) {
		setIsLoading(true);
		// reset total input FTEs and total predicted FTEs
		setAllInputFTE(0);
		setAllPredictFTE(0);
		// load configuration
		setCurrentDisplayConfig(selectedName);
		fetch(apiHost + "/config?name=" + selectedName)
			.then(response => response.json())
			.then(config => {
				fetch(apiHost + "/workload?name=" + selectedName)
					.then(response => response.json())
					.then(workloads => {
						fetch(apiHost + "/fetch_data?name=" + selectedName)
							.then(response => response.json())
							.then(ratios => {
								fetch(apiHost + "/psr?name=" + selectedName)
									.then(response => response.json())
									.then(psr => {
										fetch(apiHost + "/activity?name=" + selectedName)
											.then(response => response.json())
											.then(activities => {
												fetch(apiHost + "/members?name=" + selectedName)
													.then(response => response.json())
													.then(members => {
														updateConfig(config);
														updateWorkloads(workloads);
														updateExpRatios(ratios);
														updatePSRWork(psr);
														updateActivities(activities);
														updateMembers(members);
														setIsLoading(false);
														setLoadMessage(loadSucceedMessage);
														setShowLoadStatus(true);
													});
											});
									});
							});
					})
					.catch(error => {
						setSaveStatusMessage(loadFailedMessage + error.toString());
						setShowLoadStatus(true);
					});
			})
			.catch(error => {
				setSaveStatusMessage(loadFailedMessage + error.toString());
				setShowLoadStatus(true);
			});
	}

	function deleteConfig(configName) {
		setSelectedDelCfg(configName);
		currentConfigs.length === 1 ?
			setShowDeleteLastModal(true) : setShowDeleteModal(true);
	}

	function confirmDeletion(configName) {
		fetch(apiHost + "/config?name=" + configName, {method: "DELETE"})
			.then(response => response.json())
			.then(data => {
				updateConfigsList(prevList => {
					prevList.splice(prevList.indexOf(configName), 1);
					return [...prevList];
				});
				setShowDeleteModal(false);
				if (configName === currentDisplayConfig) {
					loadConfig(currentConfigs[0]);
				}
			})
			.catch(error => {
				console.log(error.toString());
			});
	}

	function onChangeCapacityHandler(event) {
		event.preventDefault();
		updateCapacity(event.target.value);
	}

	function confirmFilter() {
		Object.keys(cardsRefsMap).forEach(key => {
			if (filterMultiSelectRefs[key].current.checked) {
				cardsRefsMap[key].current.style.display = "inline-block";
			} else {
				cardsRefsMap[key].current.style.display = "none"
			}
			console.log(cardsRefsMap[key].current.style.display);
			return null;
		});
		setShowFilterModal(false);
	}

	return (
		<>
			<Navbar className="navbar " sticky="top" bg={"light"}>
				<Navbar.Brand href="#home">
					<img
						alt="icon"
						src={logo}
						width="140"
						height="50"
						className="d-inline-block align-top"
						style={{marginLeft: "2rem"}}
					/>{" "}
				</Navbar.Brand>

				<Navbar.Collapse className={"justify-content-end"}>
					<Form inline style={{marginRight: "15px"}}>
						<Navbar.Text style={{marginRight: "5px"}}>Annual Capacity
							(Hours): </Navbar.Text>
						<FormControl
							type={"number"}
							defaultValue={1570}
							aria-label="Annual Capacity (Hours)"
							onChange={onChangeCapacityHandler}
						/>
					</Form>
					<ButtonGroup>
						{/*Load Function*/}
						<Dropdown>
							<Dropdown.Toggle
								disabled={loading}
								className={"nav-button"}
								id={"loadDropdown"}
							>
								{loading ?
									<Spinner animation={"grow"} as={"span"} size={"sm"}/> :
									<b>Load</b>}
							</Dropdown.Toggle>
							<Dropdown.Menu style={{width: "max-content"}}>
								{loading ? (
									<Dropdown.Item>Loading</Dropdown.Item>
								) : (
									currentConfigs.map(config => {
										return (
											<Row style={{marginBottom: "0.4rem"}} key={config}>
												<Col
													md={{span: 1, offset: 1}}
															onClick={() => deleteConfig(config)}>
															<img
																alt={"clear_icon"}
																src={clearImage}
																className={"clear-button"}
															/>
														</Col>
														<Col>
															<Dropdown.Item onClick={() => loadConfig(config)}>
																{config}
															</Dropdown.Item>
														</Col>
													</Row>);
											}))}
									</Dropdown.Menu>
								</Dropdown>

								{/*Save Function*/}
						<Button
							className={"nav-button"}
							disabled={loading}
							onClick={() => setShowConfigNamePop(true)}>
							{loading ?
								<Spinner animation={"grow"} as={"span"} size={"sm"}/> :
								<b>Save</b>}
						</Button>

								{/*Revert Function*/}
						<Button
							className={"nav-button"}
							disabled={loading}
							onClick={() => loadConfig(currentDisplayConfig)}>
							{loading ?
								<Spinner animation={"grow"} as={"span"} size={"sm"}/> :
								<b>Revert</b>}
						</Button>

								{/*Filter out uninterested PODs*/}
						<Button
							className={"nav-button"}
							disabled={loading}
							onClick={() => setShowFilterModal(true)}>
							{loading ?
								<Spinner animation={"grow"} as={"span"} size={"sm"}/> :
								<b>Filter</b>}
						</Button>
					</ButtonGroup>

					{/*Configuration name input popup window*/}
					<Modal show={showConfigNamePop}
					       onHide={() => setShowConfigNamePop(false)}>
						<Modal.Header>
							<h4>
								<small>Create New Configuration</small>
							</h4>
						</Modal.Header>
						<Modal.Body>
							<Form>
								<Form.Group controlId={"configName"}>
									<FormControl
										placeholder={"New Configuration Name"}
										type={"text"}
										ref={configNameRef}/>
								</Form.Group>
							</Form>
							<Button
								onClick={saveConfig}
								className={"float-right nav-confirm-button"}>
								Submit
							</Button>
						</Modal.Body>
					</Modal>

					{/*Save operation status popup window*/}
					<Modal show={showSaveStatus}
					       onHide={() => setShowSaveStatus(false)}>
						<Modal.Body>
							<h5>
								<small>{saveStatusMessage}</small>
							</h5>
						</Modal.Body>
						<Modal.Footer>
							<Button variant={"secondary"}
							        onClick={() => setShowSaveStatus(false)}>
								Close
							</Button>
						</Modal.Footer>
					</Modal>

					{/*load operation status popup window*/}
					<Modal show={showLoadStatus}
					       onHide={() => setShowLoadStatus(false)}>
						<Modal.Body>
							<h5>
								<small>{loadStatusMessage}</small>
							</h5>
						</Modal.Body>
						<Modal.Footer>
							<Button variant={"secondary"}
							        onClick={() => setShowLoadStatus(false)}>
								Close
							</Button>
						</Modal.Footer>
					</Modal>

					{/*Confirm deletion operation popup window*/}
					<Modal show={showDeleteModal}
					       onHide={() => setShowDeleteModal(false)}>
						<Modal.Header>
							<h4>
								<small>Delete Saved Configuration</small>
							</h4>
						</Modal.Header>
						<Modal.Body>
							<h5>
								<small>
									Are you sure you want to delete configuration
									<b> {selectedDelCfg}?</b>
									</small>
								</h5>
							</Modal.Body>
							<Modal.Footer>
								<ButtonGroup>
									<Button
										className={"nav-confirm-button"}
										onClick={() => setShowDeleteModal(false)}
									>
										Cancel
									</Button>
									<Button
										className={"nav-confirm-button"}
										onClick={() => confirmDeletion(selectedDelCfg)}
									>
										Confirm
									</Button>
								</ButtonGroup>
							</Modal.Footer>
					</Modal>

					{/*Forbidding delete the last one saved popup window*/}
					<Modal show={showDeleteLastModal}
					       onHide={() => setShowDeleteModal(false)}>
						<Modal.Body>
							<h5>
								<small>
									<b>{selectedDelCfg}</b> is the last configuration saved. You
									cannot delete it!
								</small>
							</h5>
						</Modal.Body>
						<Modal.Footer>
							<Button variant={"secondary"}
							        onClick={() => setShowDeleteLastModal(false)}>
								Close
							</Button>
						</Modal.Footer>
						</Modal>

						<Modal show={showFilterModal}
						       onHide={() => setShowFilterModal(false)}>
							<Modal.Header>
								<h4>
									<small>PODs Filter</small>
								</h4>
							</Modal.Header>
							<Modal.Body>
								<Form>
									{Object.keys(cardsRefsMap).map(key => {
										let reference = React.createRef();
										filterMultiSelectRefs[key] = reference;
										return <Form.Check inline label={"POD" + key}
										                   ref={reference}
										                   key={"checkboxPOD" + key}
										                   style={{
											                   fontSize: "initial",
											                   marginRight: "1rem"
										                   }}/>;
									})}
								</Form>
							</Modal.Body>
							<Modal.Footer>
								<ButtonGroup>
									<Button
										className={"nav-confirm-button"}
										onClick={() => setShowFilterModal(false)}>
										Cancel
									</Button>
									<Button
										className={"nav-confirm-button"}
										onClick={confirmFilter}>
										Confirm
									</Button>
								</ButtonGroup>
							</Modal.Footer>
						</Modal>
				</Navbar.Collapse>
			</Navbar>

			<Navbar fixed={"bottom"}>
				<Navbar.Collapse className={"justify-content-end"}>
					<Navbar.Text className={"info-bar"}>
						Input FTEs:
						{loading ?
							<Spinner animation={"grow"} size={"sm"} as={"span"}
							         style={{margin: "0rem 0.4rem"}}/> :
							<b style={{margin: "0rem 0.4rem"}}>{allInputFTE.toFixed(2)}</b>
						}
						Predicted FTEs:
						{loading ?
							<Spinner animation={"grow"} size={"sm"} as={"span"}
							         style={{margin: "0rem 0.4rem"}}/> :
							<b style={{margin: "0rem 0.4em"}}> {allPredictFTE.toFixed(2)}</b>
						}
						Input Compared to Predicted:
						{
							loading ?
								<Spinner animation={"grow"} size={"sm"} as={"span"}
								         style={{margin: "0rem 0.4rem"}}/> :
								<b
									style={{
										margin: "0rem 0.4rem",
										color: (((allInputFTE / allPredictFTE) < 1) ? "red" : "green")
									}}>{((allInputFTE / allPredictFTE) * 100).toFixed(2) + "%"}</b>
						}
					</Navbar.Text>
				</Navbar.Collapse>
			</Navbar>
		</>
	);
}

export default QHNavBar;
