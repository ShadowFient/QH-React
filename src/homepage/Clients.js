import React from "react";
import { ListGroup } from "react-bootstrap";
import ClientActivity from "./ClientActivity";
import {Draggable,Droppable} from "react-beautiful-dnd";

const Clients = props => {
  const { clientsPerPOD, podId, activities } = props;
  let clients;

  if (clientsPerPOD && clientsPerPOD.length > 0) {
    clients = clientsPerPOD.map((client, index) => {
      return (
        <Draggable draggableId={"client-" + client[0].toString()} index={index}>
          {
            (provided)=> <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
            <ListGroup.Item key={index} style={{ border: "2px solid #84BD00" }}>
              {
                <ClientActivity
                  group_id={client}
                  pod_id={podId}
                  activities={activities}
                />
              }
            </ListGroup.Item>
            </div>
          }        
        </Draggable>
      );
    });
  }

return <Droppable droppableId={"pod-"+podId}>{(provided)=><div ref={provided.innerRef} {...provided.droppableProps}><ListGroup>{clients}</ListGroup>{provided.placeholder}</div>}</Droppable>;
};

export default Clients;
