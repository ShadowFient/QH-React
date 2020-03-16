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
import {DragDropContext} from 'react-beautiful-dnd'

function Workloads(props) {
  const [expRatios, setExpRatios] = useState();
  const [workloads, setWorkloads] = useState();
  const [configs, setConfigs] = useState();
  const [clients, setClients] = useState();
  const [psrWorks, setPsrWorks] = useState();
  const [activities, setActivities] = useState();
  const [capacity, setCapacity] = useState();

  const [workloadLoading, setWorkloadLoading] = useState(true);
  const [expRatioLoading, setExpRatioLoading] = useState(true);
  const [clientsConfigLoading, setClientsConfigLoading] = useState(true);
  const [psrLoading, setPSRLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [currentConfigsLoading, setCurrentConfigLoading] = useState(true);

  const cards = Array(24).fill("Loading...");

  const apiHost = "https://qhpredictiveapi.com:8000";
  // const apiHost = "http://127.0.0.1:5000";

  function setAllLoading(status) {
    setWorkloadLoading(status);
    setActivityLoading(status);
    setClientsConfigLoading(status);
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
        })
        .catch(error => {
          throw new Error(error.toString());
        });

      fetch(apiHost + "/fetch_data")
        .then(response => response.json())
        .then(expRatios => {
          setExpRatios(expRatios);
          setExpRatioLoading(false);
        })
        .catch(error => {
          throw new Error(error.toString());
        });
        fetch(apiHost + "/pod_to_clients")
        .then(response => response.json())
        .then(config => {
          setClients(config);
          setClientsConfigLoading(false);
        })
        .catch(error => {
          throw new Error(error.toString());
        });

      fetch(apiHost + "/activity")
        .then(response => response.json())
        .then(activity => {
          setActivities(activity);
          setActivityLoading(false);
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

  //for drag event
  // console.log("[Workload]");

  const onDragEnd = result =>{

    const {destination,source,draggableId} = result;

    if(!destination){
      return;
    }
    if(destination.droppableId === source.droppableId
      && destination.index === source.index){
        return;
    }
    const start = clients[parseInt(source.droppableId)];
    const finish = clients[parseInt(destination.droppableId)];
    if(start === finish){
    //replica of the pod's clients
    const newClients = Array.from(start);
    let removed = newClients.splice(source.index,1);
    //replace with removed element instead
    newClients.splice(destination.index,0,removed[0]);
    //replace
    clients[parseInt(source.droppableId)] = newClients;
    setClients(JSON.parse(JSON.stringify(clients)));
    return;
    }

    const startPod = Array.from(start);
    let removed = startPod.splice(source.index,1);
    const finishPod = Array.from(finish);
    finishPod.splice(destination.index,0,removed[0]);
    clients[parseInt(source.droppableId)] = startPod;
    clients[parseInt(destination.droppableId)] = finishPod;
    setClients(JSON.parse(JSON.stringify(clients)));

  };

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

    return Object.keys(workloads).map(key => {
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
            capacity={capacity}
          />

          {/* Predicted PSR FTE with its experience ratio */}
          <PredictPsrFTEwithExpRatio
            index={parseInt(key)}
            psrTime={(psrWorks[key].PRED_PHONE_VOLUME * 7.68 / 60).toFixed(2)}
            initExperienceRatio={expRatios[parseInt(key)].PSR_EXP_RATIO}
            ratioChangeHandler={ratioChangeHandler}
            isPcgRatio={false}
            capacity={capacity}
          />

          {/* Dropdown buttons for both PCG and PSR */}
          <DropdownButton pcgWK={pcgWk} psrWK={psrWK} gpsOfClients={table} podId={parseInt(key)} />

          {/* List the POD's clients */}
          <Clients
            clientsPerPOD={clients[parseInt(key)]}
            podId={parseInt(key)}
            gpsOfClients={table}
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
          updateCapacity={setCapacity}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          <div>
            <CardColumns>{updateCards()}</CardColumns>
          </div>
        </DragDropContext>
      </div>
    );
}

export default Workloads;
