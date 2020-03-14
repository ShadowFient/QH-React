import React, { useState } from 'react';
import { Button, Modal } from "react-bootstrap";
import {
  ResponsiveContainer,Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart
} from 'recharts';

function GraphForPCG(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const cmp = props.cmp;
  const rowData = props.data;
  const data = Array(cmp.length).fill(0);

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

  let btnPadding = {
    marginRight: "0.7rem",
    backgroundColor: "#84BD00",
    border: "0px",
    width: "100%"
  };

  return (
    <>
      <Button onClick={handleShow} style={btnPadding}>POD {props.podId} Annual Chart</Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Annual Data </Modal.Title>
        </Modal.Header>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <ComposedChart
              data={data}
              margin={{
                top: 5, right: 20, left: 0, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" padding={{ left: 30, right: 30 }}/>
              <YAxis dataKey="WorkingHours" ticks={[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000]} domain={[0, 7000]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="WorkingHours" barSize={40} fill="#82ca9d" />
              <Line type="monotone" dataKey="WorkingHours" stroke="#8884d8" fill="#8884d8"/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
            </Button>
        </Modal.Footer>
      </Modal>
    </>

  );
}

export default GraphForPCG;