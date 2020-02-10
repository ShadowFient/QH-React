import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Workloads from "./Workloads";
import Activity from "./Activity"
import PodClientMap from "./PodClientMap";

function App() {
  return (
    <div>
       <Workloads />
      {/*<Activity />*/}
      {/*<PodClientMap />*/}
    </div>


  )
}

export default App;
