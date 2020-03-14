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
    if (rowData !== null && typeof rowData !== "undefined") {
        for (let i in month) {
            let map = {
                name: month[i],
                PDC: 0,
                PAC: 0,
                Followup: 0,
                New_Alert: 0,
                Reference: 0,
                Term: 0,
                EMPGRP: 0,
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
    }

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
                            margin={{ top: 5, right: 15, left: 0, bottom: 5, }}
                            syncId="pcg"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis datakey="PDC_Success_Hours" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="PDC" fill="#8884d8" />
                            <Bar dataKey="PAC" fill="#0088FE" />
                            <Bar dataKey="Followup" fill="#00C49F" />
                            <Bar dataKey="New_Alert" fill="#0884d8" />
                            <Bar dataKey="Reference" fill="#FFBB28" />
                            <Bar dataKey="Term" fill="#FF8042" />
                            <Bar dataKey="EMPGRP" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={data}
                            margin={{ top: 50, right: 15, left: 0, bottom: 5, }}
                            syncId="pcg"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis datakey="PDC_Success_Hours" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="PDC" stroke="#8884d8" />
                            <Line type="monotone" dataKey="PAC" stroke="#0088FE" />
                            <Line type="monotone" dataKey="Followup" stroke="#00C49F" />
                            <Line type="monotone" dataKey="New_Alert" stroke="#0884d8" />
                            <Line type="monotone" dataKey="Reference" stroke="#FFBB28" />
                            <Line type="monotone" dataKey="Term" stroke="#FF8042" />
                            <Line type="monotone" dataKey="EMPGRP" stroke="#82ca9d" />
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