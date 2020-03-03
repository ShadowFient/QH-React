/* eslint-disable */
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
import GraphForPCG from "./GraphForPCG"

function Workloads(props) {
  const {clients,clientsConfigLoading} = props;
  const [expRatios, setExpRatios] = useState();
  const [workloads, setWorkloads] = useState();
   const [configs, setConfigs] = useState();
  const [psrWorks, setPsrWorks] = useState();
  const [activities, setActivities] = useState();

  const [workloadLoading, setWorkloadLoading] = useState(true);
  const [expRatioLoading, setExpRatioLoading] = useState(true);
  const [psrLoading, setPSRLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [currentConfigsLoading, setCurrentConfigLoading] = useState(true);

  const cards = Array(24).fill("Loading...");

  const apiHost = "https://qhpredictiveapi.com:8000";
  // const apiHost = "http://127.0.0.1:5000";

  function setAllLoading(status) {
    setWorkloadLoading(status);
    setActivityLoading(status);
    setExpRatioLoading(status);
    setPSRLoading(status);
    setCurrentConfigLoading(status);
  }

  const fetchWorkload = async () => {
    try {
      setAllLoading(true);

      fetch(apiHost + "/workload")
        .then(response => response.json())
        .then(workload => {
          setWorkloads(workload);
          setWorkloadLoading(false);
          console.log("workload done; status: " + workloadLoading);
        })
        .catch(error => {
          throw new Error(error.toString());
        });

      fetch(apiHost + "/fetch_data")
        .then(response => response.json())
        .then(expRatios => {
          setExpRatios(expRatios);
          setExpRatioLoading(false);
          console.log("exp_ratio done; status: " + expRatioLoading);
        })
        .catch(error => {
          throw new Error(error.toString());
        });

      fetch(apiHost + "/activity")
        .then(response => response.json())
        .then(activity => {
          setActivities(activity);
          setActivityLoading(false);
          console.log("activity done")
        })
        .catch(error => {
          throw new Error(error.toString());
        });

      fetch(apiHost + "/current_configs")
        .then(response => response.json())
        .then(current_configs => {
          setConfigs(current_configs);
          setCurrentConfigLoading(false);
        })
        .catch(error => {
          throw new Error(error.toString());
        });

      // fetch psr data
      fetch(apiHost + "/psr")    //TO DO
        .then(response => response.json())
        .then(psr => {
          setPsrWorks(psr);
          setPSRLoading(false);
        })
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
        expRatios[index].EXP_RATIO = changedRatio;
      } else {
        expRatios[index].PSR_EXP_RATIO = changedRatio;
      }
    };

    const PCGcmp = ["PDC Time", "PAC Time", "Follow Up Time", "New Alert Time",
      "Reference Time", "Term Time", "EMPGRP"];

    return Object.keys(workloads).map(key => {
      let PCGActy = [];
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
            initExperienceRatio={expRatios[parseInt(key)].EXP_RATIO}
            ratioChangeHandler={ratioChangeHandler}
            isPcgRatio={true}
          />

          {/* Predicted PSR FTE with its experience ratio */}
          <PredictPsrFTEwithExpRatio
            index={parseInt(key)}
            psrTime={(psrWorks[key].PRED_PHONE_VOLUME*psrWorks[key].SUCC_TIME_PSR_PHONE/60).toFixed(2)}
            initExperienceRatio={expRatios[parseInt(key)].PSR_EXP_RATIO}
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
                <b>More Information: </b>
              </DropdownItem>
              <DropdownItem>
                PDC Time: {PCGActy[PCGActy.length] = workloads[key].PCGPDC_TIME_HOURS.toFixed(2)}
              </DropdownItem>
              <DropdownItem>
                PAC Time: {PCGActy[PCGActy.length] = workloads[key].PCGPAC_TIME_HOURS.toFixed(2)}
              </DropdownItem>
              <DropdownItem>
                Follow Up Time: {PCGActy[PCGActy.length] = workloads[key].PCGFLLUP_TIME_HOURS.toFixed(2)}
              </DropdownItem>
              <DropdownItem>
                New Alert Time:{" "}
                {PCGActy[PCGActy.length] = workloads[key].PCGNEWALERT_TIME_HOURS.toFixed(2)}
              </DropdownItem>
              <DropdownItem>
                Reference Time: {PCGActy[PCGActy.length] = workloads[key].PCGREF_TIME_HOURS.toFixed(2)}
              </DropdownItem>
              <DropdownItem>
                Term Time: {PCGActy[PCGActy.length] = workloads[key].PCGTERM_TIME_HOURS.toFixed(2)}
              </DropdownItem>
              <DropdownItem>
                EMPGRP Time: {PCGActy[PCGActy.length] = workloads[key].PCGEMPGRP_TIME_HOURS.toFixed(2)}
              </DropdownItem>
              <DropdownItem>
                <GraphForPCG cmp={PCGcmp} data={PCGActy} />
              </DropdownItem>
            </Dropdown.Menu>
          </Dropdown>

          {/* Dropdown button for PSR */}
          <Dropdown>
            <Dropdown.Toggle
              id="total_time_dropdown"
              style={dropdownButtonStyle}
            >
              {"PSR All Time Hours: " +
                (psrWorks[key].PRED_PHONE_VOLUME*psrWorks[key].SUCC_TIME_PSR_PHONE/60).toFixed(2)}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: "100%" }}>
              <DropdownItem>
                <b>More Information: </b>
              </DropdownItem>
              <DropdownItem>
                Percentage of predicted total PSR phone calls:
                {" " + psrWorks[key].PERC_TOTAL_PSR_PHONE.toFixed(2) * 100 + "%"}
              </DropdownItem>
              <DropdownItem>
                PSR Act-Like Members: {psrWorks[key].PSR_PHONE_ACTS_LIKE_MEM.toFixed(2)}
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

  return (workloadLoading || expRatioLoading || clientsConfigLoading
    || psrLoading || activityLoading || currentConfigsLoading) ? (
      <div>
        <QHNavBar loading={(workloadLoading || expRatioLoading || clientsConfigLoading
          || psrLoading || activityLoading || currentConfigsLoading)} />
        <div>
          <CardColumns>{initializeCards()}</CardColumns>
        </div>
      </div>
    ) : (
      <div>
        <QHNavBar
          loading={(workloadLoading || expRatioLoading || clientsConfigLoading
            || psrLoading || activityLoading || currentConfigsLoading)}
          clientsConfig={clients}
          currentConfigs={configs}
          setIsLoading={setAllLoading}
          updateWorkloads={setWorkloads}
          expRatios={expRatios}
          updateExpRatios={setExpRatios}
          updateConfigsList={setConfigs}
          updatePSRWork={setPsrWorks}
        />
        <div>
          <CardColumns>{updateCards()}</CardColumns>
        </div>
      </div>
    );
}

export default Workloads;
