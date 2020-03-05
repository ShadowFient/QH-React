import React, { useState } from 'react';
import { Button, Modal } from "react-bootstrap";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


function GraphForMonthActivity(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const cmp = props.cmp;
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
            PDC_Success_Hours: 0, 
            PDC_Unsuccess_Hours: 0, 
            PAC_Success_Hours: 0, 
            PAC_Unsuccess_Hours: 0,
            Followup_Success_Hours: 0, 
            Followup_Unsuccess_Hours: 0, 
            New_Alert_Success_Hours: 0, 
            New_Alert_Unsuccess_Hours: 0,
            Ref_Success_Hours: 0, 
            Ref_Unsuccess_Hours: 0, 
            Term_Success_Hours: 0, 
            Term_Unsuccess_Hours: 0, 
            EMPGRP_Success_Hours: 0, 
            EMPGRP_Unsuccess_Hours: 0
        };
        for(let j in rowData){
            let pos=3;
            if(rowData[j][pos]===month[i]){
                for(let x in map){
                    map[x]=rowData[j][pos];
                    pos++;
                    // console.log(x+": "+map.x)
                }
                
            }
            data[i] = map;
        }
        
    }
    return (
        <>
            <Button onClick={handleShow} style={btnPadding}>Monthly Bar Chart</Button>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Montly Predicted Working Hours: </Modal.Title>
                </Modal.Header>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5, }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis datakey="PDC_Success_Hours"/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="PDC_Success_Hours" stackId="a" fill="#8884d8" />
                            <Bar dataKey="PDC_Unsuccess_Hours" stackId="a" fill="#82ca9d" />
                            <Bar dataKey="PAC_Success_Hours" stackId="b" fill="#8884d8" />
                            <Bar dataKey="PAC_Unsuccess_Hours" stackId="b" fill="#82ca9d" />
                            <Bar dataKey="Followup_Success_Hours" stackId="c" fill="#8884d8" />
                            <Bar dataKey="Followup_Unsuccess_Hours" stackId="c" fill="#82ca9d" />
                            <Bar dataKey="New_Alert_Success_Hours" stackId="d" fill="#8884d8" />
                            <Bar dataKey="New_Alert_Unsuccess_Hours" stackId="d" fill="#82ca9d" />
                            <Bar dataKey="Ref_Success_Hours" stackId="e" fill="#8884d8" />
                            <Bar dataKey="Ref_Unsuccess_Hours" stackId="e" fill="#82ca9d" />
                            <Bar dataKey="Term_Success_Hours" stackId="f" fill="#8884d8" />
                            <Bar dataKey="Term_Unsuccess_Hours" stackId="f" fill="#82ca9d" />
                            <Bar dataKey="EMPGRP_Success_Hours" stackId="g" fill="#8884d8" />
                            <Bar dataKey="EMPGRP_Unsuccess_Hours" stackId="g" fill="#82ca9d" />

                        </BarChart>
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