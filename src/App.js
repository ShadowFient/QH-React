import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Workloads from "./homepage/Workloads";
import {DragDropContext} from 'react-beautiful-dnd'

function App() {
  const [clients, setClients] = useState();
  const [clientsConfigLoading, setClientsConfigLoading] = useState(true);
  const fetchClients = async() => {
    try{
      setClientsConfigLoading(true);
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

    }
    catch(err){
      console.log(err.toString());
    }
  }
  useEffect(() => {
    fetchClients();
  }, []);
  const onDragEnd = result =>{
      //todo
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
      console.log(newClients);
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


  
  }

  return (
    
      <DragDropContext onDragEnd={onDragEnd}>
        <div>
          <Workloads clients={clients} clientsConfig={clientsConfigLoading}/>
        </div>
      </DragDropContext>
  )
}

export default App;
