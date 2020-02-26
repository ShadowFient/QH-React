import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import DropdownItem from "react-bootstrap/DropdownItem";
import Dropdown from "react-bootstrap/Dropdown";
import Clients from "./Clients";
import QHNavBar from "../shared/NavBar";
import teamLogo from "../images/group-24px.svg";
import PredictPcgFTEwithExpRatio from "./PredictPcgFTEwithExpRatio";
import PredictPsrFTEwithExpRatio from "./PredictPsrFTEwithExpRatio";

function Workloads() {
  const [pcgRatios, setPcgRatios] = useState();
  const [psrRatios, setPsrRatios] = useState();
  const [workloads, setWorkloads] = useState();
  const [clients, setClients] = useState();
  const [activities, setActivities] = useState();
  const [configs, setConfigs] = useState();
  const [psrWorks, setPsrWorks] = useState(); // initial psr

  const [workloadLoading, setWorkloadLoading] = useState(true);
  const [pcgRatioLoading, setPCGRatioLoading] = useState(true);
  const [clientsConfigLoading, setClientsConfigLoading] = useState(true);
  const [psrLoading, setPSRLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [currentConfigsLoading, setCurrentConfigLoading] = useState(true);

  const cards = Array(24).fill("Loading...");

 function setAllLoading(status)  {
   setWorkloadLoading(status);
   setActivityLoading(status);
   setClientsConfigLoading(status);
   setPCGRatioLoading(status);
   setPSRLoading(status);
   setCurrentConfigLoading(status);
 }

  const fetchWorkload = async () => {
    try {
    	setAllLoading(true);

    	fetch("https://qhpredictiveapi.com:8000/workload")
        .then(response => response.json())
        .then(workload => {
          setWorkloads(workload);
          setWorkloadLoading(false);
          console.log("workload done; status: " + workloadLoading);
        })
        .catch(error => {
          throw new Error(error.toString());
        });

      fetch("https://qhpredictiveapi.com:8000/fetch_data")
        .then(response => response.json())
        .then(pcgRatios => {
          setPcgRatios(pcgRatios);
          setPsrRatios(pcgRatios);
          setPCGRatioLoading(false);
          console.log("exp_ratio done; status: " + pcgRatioLoading);
        })
        .catch(error => {
          throw new Error(error.toString());
        });

      fetch("https://qhpredictiveapi.com:8000/pod_to_clients")
        .then(response => response.json())
        .then(config => {
          setClients(config);
          setClientsConfigLoading(false);
          console.log("clients done")
        })
        .catch(error => {
          throw new Error(error.toString());
        });

      fetch("https://qhpredictiveapi.com:8000/activity")
        .then(response => response.json())
        .then(activity => {
          setActivities(activity);
          setActivityLoading(false);
          console.log("activity done")
        })
        .catch(error => {
          throw new Error(error.toString());
        });

      fetch("https://qhpredictiveapi.com:8000/current_configs")
        .then(response => response.json())
        .then(current_configs => {
          setConfigs(current_configs);
          setCurrentConfigLoading(false);})
        .catch(error => {
          throw new Error(error.toString());
        });

      // fetch psr data
      fetch("https://qhpredictiveapi.com:8000/psr")
        .then(response => response.json())
        .then(psr => {
          setPsrWorks(psr);
          setPSRLoading(false);})
        .catch(error => {
          throw new Error(error.toString());
        });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchWorkload();
  }, []);

  const initializeCards = () => {
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
      border: "0px"
    };

    const ratioChangeHandler = (isPcgRatio, index, changedRatio) => {
      if (isPcgRatio) {
        pcgRatios[index].EXP_RATIO = changedRatio;
      } else {
        psrRatios[index].EXP_RATIO = changedRatio;
      }
    };

    return Object.keys(workloads).map(key => {
      return (
        <Card key={key} className="p-3" container="container-sm">
          <Card.Img variant="top" />
          <Card.Title>
            <img
              alt={"team_icon"}
              src={teamLogo}
              style={{ marginRight: "0.5rem" }}
              className="d-inline-block align-top"
            />
            POD {parseInt(key)}
          </Card.Title>

          {/* Predicted PCG FTE with its experience ratio */}
          <PredictPcgFTEwithExpRatio
            index={parseInt(key)}
            pcgTime={workloads[key].PCG_ALL_TIME_HOURS}
            initExperienceRatio={pcgRatios[parseInt(key)].EXP_RATIO}
            ratioChangeHandler={ratioChangeHandler}
            isPcgRatio={true}
          />

          {/* Predicted PSR FTE with its experience ratio */}
          <PredictPsrFTEwithExpRatio
            index={parseInt(key)}
            psrTime={psrWorks[key].PSR_PHONE_ACTS_LIKE_MEM}
            initExperienceRatio={psrRatios[parseInt(key)].EXP_RATIO}
            ratioChangeHandler={ratioChangeHandler}
            isPcgRatio={false}
          />

          {/* Dropdown button for PCG */}
          <Dropdown>
            <Dropdown.Toggle
              id="total_time_dropdown"
              style={dropdownButtonStyle}
            >
              {"PCG All Time Hours: " +
                workloads[key].PCG_ALL_TIME_HOURS.toFixed(2)}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: "100%" }}>
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

          {/* Dropdown button for PSR */}
          <Dropdown>
            <Dropdown.Toggle
              id="total_time_dropdown"
              style={dropdownButtonStyle}
            >
              {"PSR Act Like Hours: " +
                psrWorks[key].PSR_PHONE_ACTS_LIKE_MEM.toFixed(2)}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: "100%" }}>
              <DropdownItem>
                Percentage of predicted total PSR phone calls:
                {" " + psrWorks[key].PERC_TOTAL_PSR_PHONE.toFixed(2) * 100 + "%"}
              </DropdownItem>
            </Dropdown.Menu>
          </Dropdown>

          {/* List the POD's clients */}
          <Clients
            clientsPerPOD={clients[parseInt(key)]}
            podId={parseInt(key)}
            activities={activities}
          />
        </Card>
      );
    });
  };

  return (workloadLoading || pcgRatioLoading || clientsConfigLoading
    || psrLoading || activityLoading || currentConfigsLoading) ? (
    <div>
      <QHNavBar loading={(workloadLoading || pcgRatioLoading || clientsConfigLoading
    || psrLoading || activityLoading || currentConfigsLoading)} />
      <div>
        <CardColumns>{initializeCards()}</CardColumns>
      </div>
    </div>
  ) : (
    <div>
      <QHNavBar
        loading={(workloadLoading || pcgRatioLoading || clientsConfigLoading
          || psrLoading || activityLoading || currentConfigsLoading)}
        clientsConfig={clients}
        updateConfig={setClients}
        currentConfigs={configs}
        setIsLoading={setAllLoading}
        updateWorkloads={setWorkloads}
      />
      <div>
        <CardColumns>{updateCards()}</CardColumns>
      </div>
    </div>
  );
}

export default Workloads;
