import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import DropdownItem from "react-bootstrap/DropdownItem";
import Dropdown from "react-bootstrap/Dropdown";
import Clients from "./Clients";
import teamLogo from '../images/group-24px.svg';

function Workloads() {
  const [ratios, setRatios] = useState();
  const [workloads, setWorkloads] = useState();
  const [clients, setClients] = useState();
  const [activities, setActivities] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const cards = Array(24).fill("Loading...");

  const fetchWorkload = async () => {
    try {
      setIsLoading(true);

      const workLoad = await fetch("https://qhpredictiveapi.com:8000/workload");
      const workLoadData = await workLoad.json();
      if (!workLoad.ok) {
        throw new Error(workLoadData.message);
      }

      const ratios = await fetch("https://qhpredictiveapi.com:8000/fetch_data");
      const ratiosData = await ratios.json();
      if (!ratios.ok) {
        throw new Error(ratiosData.message);
      }

      const clients = await fetch(
        "https://qhpredictiveapi.com:8000/pod_to_clients"
      );
      const clientsData = await clients.json();
      if (!clients.ok) {
        throw new Error(clientsData.message);
      }

      const activities = await fetch("https://qhpredictiveapi.com/activity");
      const activitiesData = await activities.json();
      if (!activities.ok) {
        throw new Error(activitiesData.message);
      }

      setWorkloads(workLoadData);
      setRatios(ratiosData);
      setClients(clientsData);
      setActivities(activitiesData);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchWorkload();
  }, []);

  const initilizeCards = () => {
    return cards.map((card, index) => {
      return (
        <Card key={index} className="p-3" container={"container-sm"}>
          <Card.Body>
            <Card.Text>{card}</Card.Text>
          </Card.Body>
        </Card>
      );
    });
  };

  const updateCards = () => {
    let dropdownButtonStyle = {
      width: "100%",
      marginBottom: "1rem",
		  backgroundColor: "#84BD00",
		  "border": "0px"
	  };

    return Object.keys(workloads).map(key => {
      return (
        <Card key={key} className="p-3" container="container-sm">
          <Card.Img variant="top" />
          <Card.Title>
            <img alt={"team_icon"}
                 src={teamLogo}
                 style={{marginRight: "0.5rem"}}
                 className="d-inline-block align-top"/>
            POD {parseInt(key)}
          </Card.Title>
          <p>
            Predicted FTEs:{" "}
            {(workloads[key].PCG_ALL_TIME_HOURS / 1570).toFixed(2)}
          </p>
          <p>
            Experience Ratios: {ratios[parseInt(key)].EXP_RATIO * 100 + "%"}
          </p>
          <Dropdown>
            <Dropdown.Toggle
              id="total_time_dropdown"
              style={dropdownButtonStyle}
            >
              {"PCG All Time Hours: " +
                workloads[key].PCG_ALL_TIME_HOURS.toFixed(2)}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{"width": "100%"}}>
              <DropdownItem>
                PDC Time: {workloads[key].PCGPDC_TIME_HOURS.toFixed(2)}
              </DropdownItem>
              <DropdownItem>
                PAC Time: {workloads[key].PCGPAC_TIME_HOURS.toFixed(2)}
              </DropdownItem>
              <DropdownItem>
                Follow Up Time: {workloads[key].PCGFLLUP_TIME_HOURS.toFixed(2)}
              </DropdownItem>
              <DropdownItem>
                New Alert Time:{" "}
                {workloads[key].PCGNEWALERT_TIME_HOURS.toFixed(2)}
              </DropdownItem>
              <DropdownItem>
                Reference Time: {workloads[key].PCGREF_TIME_HOURS.toFixed(2)}
              </DropdownItem>
              <DropdownItem>
                Term Time: {workloads[key].PCGTERM_TIME_HOURS.toFixed(2)}
              </DropdownItem>
              <DropdownItem>
                EMPGRP Time: {workloads[key].PCGEMPGRP_TIME_HOURS.toFixed(2)}
              </DropdownItem>
            </Dropdown.Menu>
          </Dropdown>
          <Clients
            clientsPerPOD={clients[parseInt(key)]}
            podId={parseInt(key)}
            activities={activities}
          />
        </Card>
      );
    });
  };

  return isLoading ? (
    <CardColumns>{initilizeCards()}</CardColumns>
  ) : (
    <CardColumns>{updateCards()}</CardColumns>
  );
}

export default Workloads;
