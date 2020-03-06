import React, { useState } from 'react';
import { Button, Modal } from "react-bootstrap";
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


function GraphForMonthPCG(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const rowData = props.gpsOfClients;
    const podId = props.podId;
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
            name: month[i],
            PDC_Hours: 0,
            PAC_Hours: 0,
            Followup_Hours: 0,
            New_Alert_Hours: 0,
            Ref_Hours: 0,
            Term_Hours: 0,
            EMPGRP_Hours: 0,
        };
        for (let j = 0; j < rowData.length; j++) {
            let pos = 3;
            if (rowData[j][pos] === month[i]) {
                for (let x in map) {
                    if (typeof (map[x]) === 'number') {
                        let temp = map[x];
                        map[x] = Number(temp) + Number(rowData[j][pos]) + Number(rowData[j][pos + 1]);
                        pos++;
                    }
                    pos++;
                }
            }
        }
        data[i] = map;
    }
    let all = 0;
    for (let x in data) {
        for (let y in data[x]) {
            if (typeof data[x][y] === 'number') {
                all += data[x][y]
            }
        }
    }
    console.log(podId + ": " + all)    // check if data matches
    return (
        <>
            <Button onClick={handleShow} style={btnPadding}>POD {podId} Monthly Chart</Button>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Montly Predicted Working Hours: </Modal.Title>
                </Modal.Header>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 15, left: 0, bottom: 5, }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis datakey="PDC_Success_Hours" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="PDC_Hours" fill="#8884d8" />
                            <Bar dataKey="PAC_Hours" fill="#0088FE" />
                            <Bar dataKey="Followup_Hours" fill="#00C49F" />
                            <Bar dataKey="New_Alert_Hours" fill="#0884d8" />
                            <Bar dataKey="Ref_Hours" fill="#FFBB28" />
                            <Bar dataKey="Term_Hours" fill="#FF8042" />
                            <Bar dataKey="EMPGRP_Hours" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={data}
                            margin={{ top: 50, right: 15, left: 0, bottom: 5, }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis datakey="PDC_Success_Hours" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="PDC_Hours" stroke="#8884d8" />
                            <Line type="monotone" dataKey="PAC_Hours" stroke="#0088FE" />
                            <Line type="monotone" dataKey="Followup_Hours" stroke="#00C49F" />
                            <Line type="monotone" dataKey="New_Alert_Hours" stroke="#0884d8" />
                            <Line type="monotone" dataKey="Ref_Hours" stroke="#FFBB28" />
                            <Line type="monotone" dataKey="Term_Hours" stroke="#FF8042" />
                            <Line type="monotone" dataKey="EMPGRP_Hours" stroke="#82ca9d" />
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


export default GraphForMonthPCG;