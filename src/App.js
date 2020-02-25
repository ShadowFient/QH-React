import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Workloads from "./homepage/Workloads";
import {DragDropContext} from 'react-beautiful-dnd'

function App() {
  const onDragEnd = result =>{
      //todo
  }
  return (
    
      <DragDropContext onDragEnd={onDragEnd}>
        <div>
          <Workloads />
        </div>
      </DragDropContext>
  )
}

export default App;
