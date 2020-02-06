import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns'
import { DropdownButton } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/DropdownItem';

function Workloads() {
	const [workloads, setWorkloads] = useState();
	const [isLoadiing, setIsLoading] = useState(true);
	const cards = Array(25).fill("Loading...")

	const fetchWorkload = async () => {
		try {
		setIsLoading(true);
		const res = await fetch("http://localhost:5000/workload");
		const data = await res.json();
		if (!res.ok) {
				throw new Error(data.message);
		}
		
		setWorkloads(data);
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
	}

	const updateCards = () => {
		return Object.keys(workloads).map(key => {
			return (
				<Card className="p-3" style={{width: "18rem"}}>
						<Card.Img variant="top" />
					<Card.Title>POD {parseInt(key)}</Card.Title>
					<Card.Body>
						<Card.Text>
							<div>
								<p>Predicted FTEs: {(workloads[key].PCG_ALL_TIME_HOURS / 1570).toFixed(2)}</p>
								<DropdownButton title={"PCG All Time Hours:"+(workloads[key].PCG_ALL_TIME_HOURS).toFixed(2)} id="total_time_dropdown">
									<DropdownItem>PDC Time: {workloads[key].PCGPDC_TIME_HOURS.toFixed(2)}</DropdownItem>
									<DropdownItem>PAC Time: {workloads[key].PCGPAC_TIME_HOURS.toFixed(2)}</DropdownItem>
									<DropdownItem>Follow Up Time: {workloads[key].PCGFLLUP_TIME_HOURS.toFixed(2)}</DropdownItem>
									<DropdownItem>New Alert Time: {workloads[key].PCGNEWALERT_TIME_HOURS.toFixed(2)}</DropdownItem>
									<DropdownItem>Reference Time: {workloads[key].PCGREF_TIME_HOURS.toFixed(2)}</DropdownItem>
									<DropdownItem>Term Time: {workloads[key].PCGTERM_TIME_HOURS.toFixed(2)}</DropdownItem>
									<DropdownItem>EMPGRP Time: {workloads[key].PCGEMPGRP_TIME_HOURS.toFixed(2)}</DropdownItem>
								</DropdownButton>
							</div>
						</Card.Text>
					</Card.Body>
				</Card>
			)
		})
	}

	return isLoadiing ? 
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