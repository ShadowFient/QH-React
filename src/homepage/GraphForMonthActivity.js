import React, {useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';


function GraphForMonthActivity(props) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const rowData = props.data;
	const month = ["January", "February", "March", "April", "May", "June", "July",
		"August", "September", "October", "November", "December"];
	const data = Array(month.length).fill(0);

	let btnPadding = {
		marginRight: "0.7rem",
		backgroundColor: "#84BD00",
		border: "0px",
		width: "100%"
	};

	// Create data for graph
	for (let i in month) {
		let map = {
			name: null,
			PDC_Success: 0,
			PDC_Unsuccess: 0,
			PAC_Success: 0,
			PAC_Unsuccess: 0,
			Followup_Success: 0,
			Followup_Unsuccess: 0,
			New_Alert_Success: 0,
			New_Alert_Unsuccess: 0,
			Ref_Success: 0,
			Ref_Unsuccess: 0,
			Term_Success: 0,
			Term_Unsuccess: 0,
			EMPGRP_Success: 0,
			EMPGRP_Unsuccess: 0
		};
		for (let j in rowData) {
			let pos = 3;
			if (rowData[j][pos] === month[i]) {
				for (let x in map) {
					map[x] = rowData[j][pos];
					pos++;
				}

			}
			data[i] = map;
		}

	}

	return (
		<>
			<Button onClick={handleShow} style={btnPadding}>Monthly Chart</Button>
			<Modal show={show} onHide={handleClose} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Montly Predicted Working Hours: </Modal.Title>
				</Modal.Header>
				<div style={{width: '100%', height: 300}}>
					<h6>Overall Bar Chart</h6>
					<ResponsiveContainer>
						<BarChart
							data={data}
							margin={{top: 5, right: 15, left: 0, bottom: 50,}}
							syncId="client"
						>
							<CartesianGrid strokeDasharray="3 3"/>
							<XAxis dataKey="name"/>
							<YAxis datakey="PDC_Success"/>
							<Tooltip/>
							<Legend/>
							<Bar dataKey="PDC_Success" stackId="a" fill="#8884d8"/>
							<Bar dataKey="PDC_Unsuccess" stackId="a" fill="#82ca9d"/>
							<Bar dataKey="PAC_Success" stackId="b" fill="#8884d8"/>
							<Bar dataKey="PAC_Unsuccess" stackId="b" fill="#82ca9d"/>
							<Bar dataKey="Followup_Success" stackId="c" fill="#8884d8"/>
							<Bar dataKey="Followup_Unsuccess" stackId="c" fill="#82ca9d"/>
							<Bar dataKey="New_Alert_Success" stackId="d" fill="#8884d8"/>
							<Bar dataKey="New_Alert_Unsuccess" stackId="d" fill="#82ca9d"/>
							<Bar dataKey="Ref_Success" stackId="e" fill="#8884d8"/>
							<Bar dataKey="Ref_Unsuccess" stackId="e" fill="#82ca9d"/>
							<Bar dataKey="Term_Success" stackId="f" fill="#8884d8"/>
							<Bar dataKey="Term_Unsuccess" stackId="f" fill="#82ca9d"/>
							<Bar dataKey="EMPGRP_Success" stackId="g" fill="#8884d8"/>
							<Bar dataKey="EMPGRP_Unsuccess" stackId="g" fill="#82ca9d"/>
						</BarChart>
					</ResponsiveContainer>
				</div>

				<div style={{width: '100%', height: 300}}>
					<h6>Successful Activity Line Chart</h6>
					<ResponsiveContainer>
						<LineChart
							data={data}
							margin={{top: 5, right: 15, left: 0, bottom: 50,}}
							syncId="client"
						>
							<CartesianGrid strokeDasharray="3 3"/>
							<XAxis dataKey="name"/>
							<YAxis/>
							<Tooltip/>
							<Legend/>
							<Line dataKey="PDC_Success" stackId="a" stroke="#8884d8"/>
							{/* <Line dataKey="PDC_Unsuccess" stackId="a" stroke="#82ca9d" /> */}
							<Line dataKey="PAC_Success" stackId="b" stroke="#8884d8"/>
							{/* <Line dataKey="PAC_Unsuccess" stackId="b" stroke="#82ca9d" /> */}
							<Line dataKey="Followup_Success" stackId="c" stroke="#8884d8"/>
							{/* <Line dataKey="Followup_Unsuccess" stackId="c" stroke="#82ca9d" /> */}
							<Line dataKey="New_Alert_Success" stackId="d" stroke="#8884d8"/>
							{/* <Line dataKey="New_Alert_Unsuccess" stackId="d" stroke="#82ca9d" /> */}
							<Line dataKey="Ref_Success" stackId="e" stroke="#8884d8"/>
							{/* <Line dataKey="Ref_Unsuccess" stackId="e" stroke="#82ca9d" /> */}
							<Line dataKey="Term_Success" stackId="f" stroke="#8884d8"/>
							{/* <Line dataKey="Term_Unsuccess" stackId="f" stroke="#82ca9d" /> */}
							<Line dataKey="EMPGRP_Success" stackId="g" stroke="#8884d8"/>
							{/* <Line dataKey="EMPGRP_Unsuccess" stackId="g" stroke="#82ca9d" /> */}

						</LineChart>
					</ResponsiveContainer>
				</div>

				<div style={{width: '100%', height: 300}}>
					<h6>Unsuccessful Activity Line Chart</h6>
					<ResponsiveContainer>
						<LineChart
							data={data}
							margin={{top: 5, right: 15, left: 0, bottom: 5,}}
							syncId="client"
						>
							<CartesianGrid strokeDasharray="3 3"/>
							<XAxis dataKey="name"/>
							<YAxis/>
							<Tooltip/>
							<Legend/>
							{/* <Line dataKey="PDC_Success" stackId="a" stroke="#8884d8" /> */}
							<Line dataKey="PDC_Unsuccess" stackId="a" stroke="#82ca9d"/>
							{/* <Line dataKey="PAC_Success" stackId="b" stroke="#8884d8" /> */}
							<Line dataKey="PAC_Unsuccess" stackId="b" stroke="#82ca9d"/>
							{/* <Line dataKey="Followup_Success" stackId="c" stroke="#8884d8" /> */}
							<Line dataKey="Followup_Unsuccess" stackId="c" stroke="#82ca9d"/>
							{/* <Line dataKey="New_Alert_Success" stackId="d" stroke="#8884d8" /> */}
							<Line dataKey="New_Alert_Unsuccess" stackId="d" stroke="#82ca9d"/>
							{/* <Line dataKey="Ref_Success" stackId="e" stroke="#8884d8" /> */}
							<Line dataKey="Ref_Unsuccess" stackId="e" stroke="#82ca9d"/>
							{/* <Line dataKey="Term_Success" stackId="f" stroke="#8884d8" /> */}
							<Line dataKey="Term_Unsuccess" stackId="f" stroke="#82ca9d"/>
							{/* <Line dataKey="EMPGRP_Success" stackId="g" stroke="#8884d8" /> */}
							<Line dataKey="EMPGRP_Unsuccess" stackId="g" stroke="#82ca9d"/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				<Modal.Footer>
					<div>
						<Button variant="secondary" onClick={handleClose}>Close</Button>
					</div>
				</Modal.Footer>
			</Modal>
		</>

	);

}


export default GraphForMonthActivity; 