import React, { Component } from 'react';
import Popup from "reactjs-popup";
import './index.css';
import { Card, Button, CardBody, CardTitle, CardText, CardColumns, Row, Col, ButtonGroup } from "reactstrap";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';

class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            activities: [],
            table: new Array(),
            temp: new Map()
        }
    }

    componentDidMount() {
        fetch("http://127.0.0.1:5000/")
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
        const { error, isLoaded, activities, table, temp } = this.state;
        if (error) {
            return (
                <div>ERROR: {error.message}</div>
            )
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            {
                activities.map((activity) =>
                    <div>
                        {table.push([activity.POD, activity.Group_Name, activity.GroupID, activity.Month, activity.PCGPDC_TIME_HOURS_SUCC, activity.PCGPDC_TIME_HOURS_UNSUCC,
                        activity.PCGPAC_TIME_HOURS_SUCC, activity.PCGPAC_TIME_HOURS_UNSUCC, activity.PCGFLLUP_TIME_HOURS_SUCC, activity.PCGFLLUP_TIME_HOURS_UNSUCC,
                        activity.PCGNEWALERT_TIME_HOURS_SUCC, activity.PCGNEWALERT_TIME_HOURS_UNSUCC, activity.PCGREF_TIME_HOURS_SUCC, activity.PCGREF_TIME_HOURS_UNSUCC,
                        activity.PCGTERM_TIME_HOURS_SUCC, activity.PCGTERM_TIME_HOURS_UNSUCC, activity.PCGEMPGRP_TIME_HOURS_SUCC, activity.PCGEMPGRP_TIME_HOURS_UNSUCC])}

                    </div>
                )
            }
            return <ParseData value={table} />
        }
    }
}
function ParseData(props) {
    const table = props.value
    var podnum = new Map()
    var id = new Map()
    var i
    for (i in table) {
        var x = table[i][0]
        if (podnum.has(x)) {
            var z = podnum.get(x)
            var y = table[i]
            var temp = new Array()
            // console.log(z)
            if (Array.isArray(z[0])) {
                for (var ele = 0; ele < z.length; ele++) {
                    temp[temp.length] = z[ele]
                }
            } else {
                temp[temp.length] = z
            }


            temp[temp.length] = y
            podnum.set(x, temp)
        } else {
            podnum.set(x, table[i])
        }
    }
    return <CardDisplay value={podnum} />
}

function CardDisplay(props) {
    var data = props.value

    //store keys
    var x = data.keys()
    var keys = new Array()
    for (var i of x) {
        keys.push(i)
    }
    keys.sort(function (a, b) { return a - b })

    var pt = new Array()

    for (var j of keys) {
        var vl = [] //all clients that belong to POD ${j}
        var c = data.get(j)

        // //call DropDownSelection function
        // var month_list = <DropDownSelection value={c} />

        // call PopupWindows function
        for (var b of c) { //b : one pod -- one client in multiple clients
            vl[vl.length] = (<PopupWindows value={b} />)
        }
        pt.push(<div><Card><CardTitle><h5><center>POD: {j}</center></h5></CardTitle><CardBody>{vl}</CardBody></Card></div>)
        // pt.push(<div class="container-sm"><Card><CardTitle>POD: {j}</CardTitle><CardBody>{month_list}</CardBody></Card></div>)
    }
    return (
        <div>
            {pt.map((item) =>
                <div>
                    {item}
                </div>
            )}
        </div>
    )
}

function DropDownSelection(props) {
    var data = props.value // all clients in on pod

    var groupN = data[0][1]

    var cmp = ["PCGPDC_TIME_HOURS_SUCC", "PCGPDC_TIME_HOURS_UNSUCC", "PCGPAC_TIME_HOURS_SUCC",
        "PCGPAC_TIME_HOURS_UNSUCC", "PCGFLLUP_TIME_HOURS_SUCC", "PCGFLLUP_TIME_HOURS_UNSUCC",
        "PCGNEWALERT_TIME_HOURS_SUCC", "PCGNEWALERT_TIME_HOURS_UNSUCC", "PCGREF_TIME_HOURS_SUCC",
        "PCGREF_TIME_HOURS_UNSUCC", "PCGTERM_TIME_HOURS_SUCC", "PCGTERM_TIME_HOURS_UNSUCC",
        "PCGEMPGRP_TIME_HOURS_SUCC", "PCGEMPGRP_TIME_HOURS_UNSUCC"]
    var mth = new Map()
    
    var result = new Array()
    for (var single of data) {
        if (mth.has(single[3])) {
            // result.push(<h5>{groupN}</h5>)
            var keys = [ ...mth.keys()]
            result.push(
                <UncontrolledDropdown >
                    <DropdownToggle caret>
                        Month
                    </DropdownToggle>
                    <DropdownMenu>
                    <DropdownItem header>{groupN}</DropdownItem>
                    <div> {keys.map((ele) =>
                            <div>
                                {/* <DropdownItem>{ele}</DropdownItem> */}
                                <Popup modal trigger={<button class="button">{ele}</button>} position="right bottom">
                                    {close => (
                                        <ListGroup>
                                            {mth.get(ele).map((ele1) => <ListGroupItem>{cmp.shift()}: {ele1}</ListGroupItem>)}
                                            <a className="close" onClick={close}>
                                                &times;
                                            </a>
                                        </ListGroup>
                                    )}
                                </Popup></div>

                        )}</div>
                    </DropdownMenu>
                </UncontrolledDropdown>
            )
            groupN = single[1]
            mth.clear()
            mth.set(single[3], single.splice(4, 14))
        } else {
            mth.set(single[3], single.splice(4, 14))
        }

    }

    return <div>{result}</div>
}


var groupName = ""

function PopupWindows(props) {
    var html = []
    var data = props.value
    var cmp = ["PCGPDC_TIME_HOURS_SUCC", "PCGPDC_TIME_HOURS_UNSUCC", "PCGPAC_TIME_HOURS_SUCC",
        "PCGPAC_TIME_HOURS_UNSUCC", "PCGFLLUP_TIME_HOURS_SUCC", "PCGFLLUP_TIME_HOURS_UNSUCC",
        "PCGNEWALERT_TIME_HOURS_SUCC", "PCGNEWALERT_TIME_HOURS_UNSUCC", "PCGREF_TIME_HOURS_SUCC",
        "PCGREF_TIME_HOURS_UNSUCC", "PCGTERM_TIME_HOURS_SUCC", "PCGTERM_TIME_HOURS_UNSUCC",
        "PCGEMPGRP_TIME_HOURS_SUCC", "PCGEMPGRP_TIME_HOURS_UNSUCC"]

    
    if (groupName.localeCompare(data[1]) !== 0) {
        groupName = data[1]
        html.push(<CardTitle class="nextline">{groupName}</CardTitle>)
    }

    html.push(
        <Popup modal trigger={<button class="button">{data[3]}</button>} position="right bottom">
            {close => (
                <ListGroup>
                    {data.splice(4, 14).map((ele) => <ListGroupItem>{cmp.shift()}: {ele}</ListGroupItem>)}
                    <a className="close" onClick={close}>
                        &times;
                    </a>
                </ListGroup>
            )}
        </Popup>

    )
    return <div class="container-sm">{html}</div>
}

//////// ideal
// function AS(props){
//     var data=props.value
//     var x=data.keys() 
//     var keys= new Array()
//     for (var i of x){
//         keys.push(i)
//     }
//     keys.sort(function(a, b){return a - b})
//     // console.log(keys[1],keys[4])

//     var podtoclient=new Map()
//     var monthMao=new Map()
//     for (var i of keys){
//         var list=data.get(i)
//         var arr=[]
//         for(var j in list){


//         }
//     }
//     return(
//         <div>
//             <Row>
//             <Col sm="6">
//                 <Card body>
//                     <CardTitle>POD</CardTitle>
//                     <select>
//                         {keys.map((key)=>
//                             <option>{key}</option>
//                         )}
//                     </select>
//                     <CardTitle>POD's Client</CardTitle>
//                     <select>

//                     </select>
//                     {/* <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
//                     <Button>Go somewhere</Button> */}

//                 </Card>
//             </Col>
//             <Col sm="6">
//                 <Card body>
//                     <CardTitle>Statistic Graph</CardTitle>
//                     <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
//                     <Button>Go somewhere</Button>
//                 </Card>
//             </Col>
//             </Row>
//         </div>
//     )
// }
export default Activity;