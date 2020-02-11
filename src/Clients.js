import React, {useEffect} from "react";
import {ListGroup} from "react-bootstrap";

const Clients = props => {
    const clientsArray = props.data;
    // console.log(clientsArray);
    let clients;

    if (clientsArray && clientsArray.length > 0) {
        clients = clientsArray.map(client => {
            return (<ListGroup.Item style={{"border": "1px solid rgba(0,0,0,.125)"}}>{client}</ListGroup.Item>);
        });
    }

    return (
        <ListGroup>
            {clients}
        </ListGroup>
    )
};

export default Clients;