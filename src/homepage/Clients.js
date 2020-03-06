import React from "react";
import { ListGroup } from "react-bootstrap";
import ClientActivity from "./ClientActivity";
import {Draggable,Droppable} from "react-beautiful-dnd";
import _ from 'lodash';


const Clients = props => {
  const { clientsPerPOD, podId, gpsOfClients } = props;
  let clients;

  if (clientsPerPOD && clientsPerPOD.length > 0) {
    clients = clientsPerPOD.map((client, index) => {
      return (
        <Draggable draggableId={client[1]} index={index} key={client[1]}>
          {
            (provided)=> <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
            <ListGroup.Item key={client[1]} style={{ border: "2px solid #84BD00" }}>
              {
                <ClientActivity
                  group_id={client}
                  pod_id={podId}
                  gpsOfClients={gpsOfClients}
                />
              }
            </ListGroup.Item>
            </div>
          }        
        </Draggable>
      );
    });
  }

return <Droppable droppableId={podId.toString()}>{(provided)=><div ref={provided.innerRef} {...provided.droppableProps}><ListGroup>{clients}</ListGroup>{provided.placeholder}</div>}</Droppable>;
};

const areEqual = (prevProps, nextProps) => {
  // console.log("Pod " + _.isEqual(prevProps.clientsPerPOD, nextProps.clientsPerPOD));
  return _.isEqual(prevProps.clientsPerPOD, nextProps.clientsPerPOD);
}

export default React.memo(Clients, areEqual);