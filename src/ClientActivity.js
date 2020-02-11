import React, {useState} from "react";
import "./index.css";
import { Button, ListGroup, ListGroupItem, Modal} from "react-bootstrap";

const ClientActivity = props => {
  const table = [];
  const { activities, group_id, pod_id } = props;


  activities.map(activity => (
    <div>
      {table.push([
        activity.POD,
        activity.Group_Name,
        activity.GroupID,
        activity.Month,
        activity.PCGPDC_TIME_HOURS_SUCC,
        activity.PCGPDC_TIME_HOURS_UNSUCC,
        activity.PCGPAC_TIME_HOURS_SUCC,
        activity.PCGPAC_TIME_HOURS_UNSUCC,
        activity.PCGFLLUP_TIME_HOURS_SUCC,
        activity.PCGFLLUP_TIME_HOURS_UNSUCC,
        activity.PCGNEWALERT_TIME_HOURS_SUCC,
        activity.PCGNEWALERT_TIME_HOURS_UNSUCC,
        activity.PCGREF_TIME_HOURS_SUCC,
        activity.PCGREF_TIME_HOURS_UNSUCC,
        activity.PCGTERM_TIME_HOURS_SUCC,
        activity.PCGTERM_TIME_HOURS_UNSUCC,
        activity.PCGEMPGRP_TIME_HOURS_SUCC,
        activity.PCGEMPGRP_TIME_HOURS_UNSUCC
      ])}
    </div>
  ));
  return <ParseData value={table} group_id={group_id} pod_id={pod_id} />;
};

function ParseData(props) {
  const table = props.value;
  const groupid = props.group_id;
  const podid = props.pod_id;
  var podnum = new Map();
  let i;
  for (i in table) {
    let x = table[i][0]; //set pod id as key
    if (podnum.has(x)) {
      let z = podnum.get(x);
      let y = table[i];
      let temp = [];
      if (Array.isArray(z[0])) {
        for (let ele = 0; ele < z.length; ele++) {
          temp[temp.length] = z[ele];
        }
      } else {
        temp[temp.length] = z;
      }
      temp[temp.length] = y;
      podnum.set(x, temp);
    } else {
      podnum.set(x, table[i]);
    }
  }
  const getpod = podnum.get(podid);
  return <CardDisplay value={getpod} group_id={groupid} />;
}

function CardDisplay(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const gpsOfClients = props.value;
  const groupid = props.group_id;
  const data = Array(14).fill(0);
  const cmp = [
    "PDC Success Hours",
    "PDC Unsuccess Hours",
    "PAC Success Hours",
    "PAC Unsuccess Hours",
    "Followup Success Hours",
    "Followup Unsuccess Hours",
    "New Alert Success Hours",
    "NEW Alert Unsuccess Hours",
    "Ref Success Hours",
    "Ref Unsuccess Hours",
    "Term Success Hours",
    "Term Unsuccess Hours",
    "EMPGRP Success Hours",
    "EMPGRP Unsuccess Hours"
  ];
  for (let i in gpsOfClients) {
    if (gpsOfClients[i][2] === groupid) {
      for (let j in data) {
        data[j] =
          Number(data[j]) + Number(gpsOfClients[i][Number(j) + Number(4)]);
      }
    }
  }
  return (
  	<>
  	<button className="button" onClick={handleShow}>{groupid}</button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Clients: {groupid}</Modal.Title>
        </Modal.Header>
        <ListGroup>
          {data.map((ele, index) => (
            <ListGroupItem key={index} sytle={{"font-size": "large"}}>
              {cmp[index]}: {ele.toFixed(2)}
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

export default ClientActivity;
