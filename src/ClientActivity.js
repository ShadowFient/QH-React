import React, { Component } from 'react';
import Popup from "reactjs-popup";
import './index.css';
import { ListGroup, ListGroupItem } from 'react-bootstrap';


class ClientActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            activities: [],
            table: [],
            temp: new Map()
        }
    }

    componentDidMount() {
        fetch("https://qhpredictiveapi.com/activity")
            .then(res => res.json())
            .then(
                (data) => {
                    this.setState({
                        isLoaded: true,
                        activities: data
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )
    }

    render() {
        const { error, isLoaded, activities, table } = this.state;

        var groupid = this.props.group_id
        var podid = this.props.pod_id
        if (error) {
            return (
                <div>ERROR: {error.message}</div>
            )
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            activities.map((activity) =>
                <div>
                    {table.push([activity.POD, activity.Group_Name, activity.GroupID, activity.Month, activity.PCGPDC_TIME_HOURS_SUCC, activity.PCGPDC_TIME_HOURS_UNSUCC,
                    activity.PCGPAC_TIME_HOURS_SUCC, activity.PCGPAC_TIME_HOURS_UNSUCC, activity.PCGFLLUP_TIME_HOURS_SUCC, activity.PCGFLLUP_TIME_HOURS_UNSUCC,
                    activity.PCGNEWALERT_TIME_HOURS_SUCC, activity.PCGNEWALERT_TIME_HOURS_UNSUCC, activity.PCGREF_TIME_HOURS_SUCC, activity.PCGREF_TIME_HOURS_UNSUCC,
                    activity.PCGTERM_TIME_HOURS_SUCC, activity.PCGTERM_TIME_HOURS_UNSUCC, activity.PCGEMPGRP_TIME_HOURS_SUCC, activity.PCGEMPGRP_TIME_HOURS_UNSUCC])}

                </div>
            );
            return <ParseData value={table} group_id={groupid} pod_id={podid} />
        }
    }
}
function ParseData(props) {
    const table = props.value;
    const groupid = props.group_id;
    const podid = props.pod_id;
    var podnum = new Map();
    let i;
    for (i in table) {
        let x = table[i][0];    //set pod id as key
        if (podnum.has(x)) {
            let z = podnum.get(x);
            let y = table[i];
            let temp = [];
            if (Array.isArray(z[0])) {
                for (let ele = 0; ele < z.length; ele++) {
                    temp[temp.length] = z[ele]
                }
            } else {
                temp[temp.length] = z;
            }
            temp[temp.length] = y;
            podnum.set(x, temp);
        } else {
            podnum.set(x, table[i]);
        }
    }
    var getpod = podnum.get(podid)
    return <CardDisplay value={getpod} group_id={groupid} />
}

function CardDisplay(props) {
    var gpsOfClients = props.value;
    var groupid=props.group_id;
    var data = Array(14).fill(0);
    var cmp = ["PCGPDC_TIME_HOURS_SUCC", "PCGPDC_TIME_HOURS_UNSUCC", "PCGPAC_TIME_HOURS_SUCC",
        "PCGPAC_TIME_HOURS_UNSUCC", "PCGFLLUP_TIME_HOURS_SUCC", "PCGFLLUP_TIME_HOURS_UNSUCC",
        "PCGNEWALERT_TIME_HOURS_SUCC", "PCGNEWALERT_TIME_HOURS_UNSUCC", "PCGREF_TIME_HOURS_SUCC",
        "PCGREF_TIME_HOURS_UNSUCC", "PCGTERM_TIME_HOURS_SUCC", "PCGTERM_TIME_HOURS_UNSUCC",
        "PCGEMPGRP_TIME_HOURS_SUCC", "PCGEMPGRP_TIME_HOURS_UNSUCC"]
    for(var i in gpsOfClients){
        if(gpsOfClients[i][2]===groupid){
            for(var j in data){
                data[j]=Number(data[j])+Number(gpsOfClients[i][Number(j)+Number(4)])
            }
        }
    }
    return (
        <Popup modal trigger={<button class="button">{groupid}</button>} position="right bottom">
            {close => (
                <ListGroup>
                    {data.map((ele,index) => <ListGroupItem>{cmp[index]}: {ele}</ListGroupItem>)}
                    <a className="close" onClick={close}>
                        &times;
                    </a>
                </ListGroup>
            )}
        </Popup>
    )
}



export default ClientActivity;