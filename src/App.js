import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import QHNavBar from './shared/NavBar';
import Workloads from "./homepage/Workloads";

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
