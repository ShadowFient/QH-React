import React from "react";
import {ListGroup} from "react-bootstrap";
import ClientActivity from './ClientActivity'
const Clients = ({data,podid}) => {
    const clientsArray = data;
    let clients;
    
    if (clientsArray && clientsArray.length > 0) {
        clients = clientsArray.map((client, index) => {
            console.log(index)
            return (
                <ListGroup.Item key={index} style={{"border": "2px solid #84BD00"}}>
                    {<ClientActivity group_id={client} pod_id={podid} />}
                </ListGroup.Item>
            );
        });
    }

    return (
        <ListGroup>
            {clients}
        </ListGroup>
    );
};

export default Clients;