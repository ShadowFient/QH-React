import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import QHNavBar from './NavBar'
import Workloads from "./Workloads";

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
