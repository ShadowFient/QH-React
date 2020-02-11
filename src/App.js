import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Workloads from "./Workloads";
import Activity from "./Activity"
import QHNavBar from "./NavBar"

function App() {
  return (
      <div>
          <QHNavBar />
          <div>
              <Workloads />
              {/*<Activity />*/}
          </div>
      </div>
  )
}

export default App;
