import React, {useState} from "react";
import "../index.css";
import {Button, ListGroup, ListGroupItem, Modal} from "react-bootstrap";
import GraphForActivity from "./GraphForActivity"
import GraphForMonthActivity from "./GraphForMonthActivity";

const clientLevelWork = {};

function ClientActivity(props) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const gpsOfClients = props.gpsOfClients;
	const groupid = props.group_id;
	const clientMem = props.clientMem;
	const data = Array(14).fill(0);
	const client_data = Array(8).fill(0);
	const monthdt = [];
	const cmp = [
		"PDC Success",
		"PDC Unsuccess",
		"PAC Success",
		"PAC Unsuccess",
		"Followup Success",
		"Followup Unsuccess",
		"New Alert Success",
		"New Alert Unsuccess",
		"Ref Success",
		"Ref Unsuccess",
		"Term Success",
		"Term Unsuccess",
		"EMPGRP Success",
		"EMPGRP Unsuccess"
	];

	// Calculate annual hours for each activity
	for (let i in gpsOfClients) {
		if (gpsOfClients[i][2] === groupid[0]) {
			var total = 0.0;
			monthdt[monthdt.length] = gpsOfClients[i];
			for (let j in data) {

				if (j < 8) {
					if (parseInt(j) === 7) {
						client_data[7] = total;
					} else {
						client_data[j] += Number(gpsOfClients[i][(2 * j) + 4]) + Number(gpsOfClients[i][(2 * j + 1) + 4]);
						total += client_data[j];
					}

				}
				data[j] =
					Number(data[j]) + Number(gpsOfClients[i][Number(j) + Number(4)]);
			}
		}
	}
	clientLevelWork[groupid[1]] = client_data;
	return (
		<>
			<button className="button" onClick={handleShow}>{groupid[1]} <small
				className="membertext"> (Members: {clientMem.get(groupid[1].toString())})</small>
			</button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Clients: {groupid[1]}</Modal.Title>
				</Modal.Header>
				<ListGroup>
					<ListGroupItem><GraphForActivity cmp={cmp}
					                                 data={data}/></ListGroupItem>
					<ListGroupItem><GraphForMonthActivity data={monthdt}/></ListGroupItem>
					{data.map((ele, index) => (
						<ListGroupItem key={index}>
							<h5><small>{cmp[index]}: {ele.toFixed(2)}</small></h5>
						</ListGroupItem>
					))}
				</ListGroup>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

const areEqual = (prevProps, nextProps) => {
	return true;
};

export default React.memo(ClientActivity, areEqual);
export {clientLevelWork};