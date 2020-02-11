import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Workloads from "./Workloads";
import Activity from "./Activity"
import QHNavBar from "./NavBar"
import PodClientMap from "./PodClientMap";

function App() {
  return (
      <div>
          <QHNavBar />
          <div>
              <Workloads />
          </div>
      </div>
  )
}

export default App;
