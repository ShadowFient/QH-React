/* eslint-disable */
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import Clients from "./Clients";
import QHNavBar from "../shared/NavBar";
import teamLogo from "../images/group-24px.svg";
import PredictPcgFTEwithExpRatio from "./PredictPcgFTEwithExpRatio";
import PredictPsrFTEwithExpRatio from "./PredictPsrFTEwithExpRatio";
import DropdownButton from "./DropdownButton";

function Workloads(props) {
  const { clients, setClients, clientsConfigLoading } = props;
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

      fetch("http://127.0.0.1:5000/activity")
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
      fetch(apiHost + "/psr")
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
    const ratioChangeHandler = (isPcgRatio, index, changedRatio) => {
      if (isPcgRatio) {
        expRatios[index].EXP_RATIO = changedRatio;
      } else {
        expRatios[index].PSR_EXP_RATIO = changedRatio;
      }
    };
    
    // Fetch activities
    const table = [];
    activities.map(activity => (
      <div>
        {table.push([
          activity.INITIAL_POD,
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
   
    const PODmap = new Map();
    for (let element in table) {
        let pod_id = table[element][0]; //set pod id as key
      if (PODmap.has(pod_id)) {
        let stored = PODmap.get(pod_id);
        let addon = table[element];
        let temp = [];
        if (Array.isArray(stored[0])) {
          for (let ele = 0; ele < stored.length; ele++) {
            temp[temp.length] = stored[ele];
          }
        } else {
          temp[temp.length] = stored;
        }
        temp[temp.length] = addon;
        PODmap.set(pod_id, temp);
      } else {
        PODmap.set(pod_id, table[element]);
      }
    }

    return Object.keys(workloads).map(key => {     
      let gpsOfClients=PODmap.get(parseInt(key));
      let pcgWk = workloads[key];
      let psrWK = psrWorks[key];

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
            psrTime={(psrWorks[key].PRED_PHONE_VOLUME * 7.68 / 60).toFixed(2)}
            initExperienceRatio={expRatios[parseInt(key)].PSR_EXP_RATIO}
            ratioChangeHandler={ratioChangeHandler}
            isPcgRatio={false}
          />

          {/* Dropdown buttons for both PCG and PSR */}
          <DropdownButton pcgWK={pcgWk} psrWK={psrWK} gpsOfClients={gpsOfClients} podId={parseInt(key)} />

          {/* List the POD's clients */}
          <Clients
            clientsPerPOD={clients[parseInt(key)]}
            podId={parseInt(key)}
            gpsOfClients={gpsOfClients}
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
          updateConfig={setClients}
          currentConfigs={configs}
          setIsLoading={setAllLoading}
          updateWorkloads={setWorkloads}
          expRatios={expRatios}
          updateExpRatios={setExpRatios}
          updateConfigsList={setConfigs}
          updatePSRWork={setPsrWorks}
          updateActivities={setActivities}
        />
        <div>
          <CardColumns>{updateCards()}</CardColumns>
        </div>
      </div>
    );
}

export default Workloads;
