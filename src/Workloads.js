import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns'
import {Col, Container, DropdownButton, Row} from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/DropdownItem';
import Clients from "./Clients";

function Workloads() {
	const [ratios, setRatios]  = useState();
	const [workloads, setWorkloads] = useState();
	const [clients, setClients] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const cards = Array(24).fill("Loading...");

	const fetchWorkload = async () => {
		try {
		setIsLoading(true);

		const workLoad = await fetch("https://qhpredictiveapi.com:8000/workload");
		const workLoadData = await workLoad.json();
		if (!workLoad.ok) {
			throw new Error(workLoadData.message);
		}

		const ratios = await fetch("https://qhpredictiveapi.com:8000/fetch_data");
		const ratiosData = await ratios.json();
		if (!ratios.ok) {
			throw new Error(ratiosData.message);
		}

		const clients = await fetch("https://qhpredictiveapi.com:8000/pod_to_clients");
		const clientsData = await clients.json();
		if (!clients.ok) {
			throw new Error(clientsData.message);
		}

		setWorkloads(workLoadData);
		setRatios(ratiosData);
		setClients(clientsData);
		// console.log(clientsData);

		setIsLoading(false);

		} catch (err) {
		console.log(err);
		}
	};
	useEffect(() => {
		fetchWorkload();
	}, []);


	const initilizeCards = () => {
		return cards.map(card => {
			return (
			<Card className="p-3" style={{width: "18rem"}}>
				<Card.Body>
					<Card.Text>{card}</Card.Text>
				</Card.Body>
			</Card>
			)
		});
	};

	const updateCards = () => {
		return Object.keys(workloads).map(key => {
			return (
				<Card key={key} className="p-3" style={{width: "18rem"}}>
						<Card.Img variant="top" />
					<Card.Title>POD {parseInt(key)}</Card.Title>
					<Card.Body>
						<Card.Text>
							<div>
								<p>Predicted FTEs: {(workloads[key].PCG_ALL_TIME_HOURS / 1570).toFixed(2)}</p>
								<p>Experience Ratios: {ratios[parseInt(key)].EXP_RATIO * 100 + "%"}</p>
								<Container>
									<Row>
										<Col>
								<DropdownButton title={"PCG All Time Hours:"+(workloads[key].PCG_ALL_TIME_HOURS).toFixed(2)} id="total_time_dropdown">
									<DropdownItem>PDC Time: {workloads[key].PCGPDC_TIME_HOURS.toFixed(2)}</DropdownItem>
									<DropdownItem>PAC Time: {workloads[key].PCGPAC_TIME_HOURS.toFixed(2)}</DropdownItem>
									<DropdownItem>Follow Up Time: {workloads[key].PCGFLLUP_TIME_HOURS.toFixed(2)}</DropdownItem>
									<DropdownItem>New Alert Time: {workloads[key].PCGNEWALERT_TIME_HOURS.toFixed(2)}</DropdownItem>
									<DropdownItem>Reference Time: {workloads[key].PCGREF_TIME_HOURS.toFixed(2)}</DropdownItem>
									<DropdownItem>Term Time: {workloads[key].PCGTERM_TIME_HOURS.toFixed(2)}</DropdownItem>
									<DropdownItem>EMPGRP Time: {workloads[key].PCGEMPGRP_TIME_HOURS.toFixed(2)}</DropdownItem>
								</DropdownButton>

										</Col>

									</Row>
									<Row>
										<Col>
											<Clients data={clients[parseInt(key)]} />
										</Col>
									</Row>
								</Container>
							</div>
						</Card.Text>
					</Card.Body>
				</Card>
			)
		})
	};

	return isLoading ?
	(
	<CardColumns>
		{initilizeCards()}
	</CardColumns>
	) : (
	<CardColumns>
		{updateCards()}
	</CardColumns>
	);
}

export default Workloads;