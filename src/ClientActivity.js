import React from "react";
import Popup from "reactjs-popup";
import "./index.css";
import { ListGroup, ListGroupItem } from "react-bootstrap";

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
  const gpsOfClients = props.value;
  const groupid = props.group_id;
  const data = Array(14).fill(0);
  const cmp = [
    "PCGPDC_TIME_HOURS_SUCC",
    "PCGPDC_TIME_HOURS_UNSUCC",
    "PCGPAC_TIME_HOURS_SUCC",
    "PCGPAC_TIME_HOURS_UNSUCC",
    "PCGFLLUP_TIME_HOURS_SUCC",
    "PCGFLLUP_TIME_HOURS_UNSUCC",
    "PCGNEWALERT_TIME_HOURS_SUCC",
    "PCGNEWALERT_TIME_HOURS_UNSUCC",
    "PCGREF_TIME_HOURS_SUCC",
    "PCGREF_TIME_HOURS_UNSUCC",
    "PCGTERM_TIME_HOURS_SUCC",
    "PCGTERM_TIME_HOURS_UNSUCC",
    "PCGEMPGRP_TIME_HOURS_SUCC",
    "PCGEMPGRP_TIME_HOURS_UNSUCC"
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
    <Popup
      modal
      trigger={<button className="button">{groupid}</button>}
      position="right bottom"
    >
      {close => (
        <ListGroup>
          {data.map((ele, index) => (
            <ListGroupItem key={index}>
              {cmp[index]}: {ele.toFixed(2)}
            </ListGroupItem>
          ))}
          <a className="close" onClick={close}>
            &times;
          </a>
        </ListGroup>
      )}
    </Popup>
  );
}

export default ClientActivity;
