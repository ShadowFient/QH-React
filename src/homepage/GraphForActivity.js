import React, { useState } from 'react';
import {Button, Modal} from "react-bootstrap";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


function GraphForActivity(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const cmp = props.cmp;
  const rowData = props.data;
  const data = Array(cmp.length).fill(0);

	let btnPadding = {
		marginRight: "0.7rem",
		backgroundColor: "#84BD00",
		border: "0px",
    width: "100%"
	};

  // Create data for graph
  let i;
  for (i in cmp) {
    let map = { name: null, WorkingHours: 0 };
    let temp = cmp[i];
    let temp1 = rowData[i];
    map.name = temp;
    map.WorkingHours = temp1;
    data[i] = map;
  }

  return (
    <>
      <Button onClick={handleShow} style={btnPadding}>Annual Bar Chart</Button>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Annual Predicted Working Hours: </Modal.Title>
        </Modal.Header>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{top: 5, right: 20, left: 0, bottom: 5,}}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis dataKey="WorkingHours" />
              <Tooltip />
              <Legend />
              <Bar dataKey="WorkingHours" fill="#8884d8" />
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


export default GraphForActivity; 