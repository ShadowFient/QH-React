import React from "react";
import {ListGroup} from "react-bootstrap";

const Clients = props => {
    const clientsArray = props.data;
    let clients;

    if (clientsArray && clientsArray.length > 0) {
        clients = clientsArray.map((client, index) => {
            return (<ListGroup.Item key={index} style={{"border": "3px solid #84BD00"}}>{client}</ListGroup.Item>);
        });
    }

    return (
        <ListGroup>
            {clients}
        </ListGroup>
    );
};

export default Clients;