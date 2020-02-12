import React from "react";
import { ListGroup } from "react-bootstrap";
import ClientActivity from "./ClientActivity";

const Clients = props => {
  const { clientsPerPOD, podId, activities } = props;
  let clients;

  if (clientsPerPOD && clientsPerPOD.length > 0) {
    clients = clientsPerPOD.map((client, index) => {
      return (
        <ListGroup.Item key={index} style={{ border: "2px solid #84BD00" }}>
          {
            <ClientActivity
              group_id={client}
              pod_id={podId}
              activities={activities}
            />
          }
        </ListGroup.Item>
      );
    });
  }

  return <ListGroup>{clients}</ListGroup>;
};

export default Clients;
