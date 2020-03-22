import React from "react";
import DropdownItem from "react-bootstrap/DropdownItem";
import Dropdown from "react-bootstrap/Dropdown";
import GraphForPCG from "./GraphForPCG";
import GraphForMonthPCG from "./GraphForMonthPCG";


function DropdownButton(props) {
    const pcg = props.pcgWK;
    const psr=props.psrWK;
    const gpsOfClients=props.gpsOfClients;
    const pod_key = parseInt(props.pod_key);
    const PCGActy = [];
    const PCGcmp = ["PDC", "PAC", "Follow Up", "New Alert",
        "Reference", "Term", "EMPGRP"];

    let dropdownButtonStyle = {
        width: "100%",
        marginBottom: "1rem",
        backgroundColor: "#84BD00",
        border: "0px"
        };

    return (
        <>
        {/* Dropdown button for PCG */}
        <Dropdown>
            <Dropdown.Toggle
                id="total_time_dropdown"
                style={dropdownButtonStyle}
            >
                <label id={"total_pcg_"+pod_key.toString()}>
                {"PCG All Time Hours: " + parseFloat(pcg.PCG_ALL_TIME_HOURS).toFixed(2)}
                </label>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: "100%" }}>
                <DropdownItem>
                    <b>More Information: </b>
                </DropdownItem>
                <DropdownItem>
                    PDC Time: {PCGActy[PCGActy.length] = pcg.PCGPDC_TIME_HOURS.toFixed(2)}
                </DropdownItem>
                <DropdownItem>
                    PAC Time: {PCGActy[PCGActy.length] = pcg.PCGPAC_TIME_HOURS.toFixed(2)}
                </DropdownItem>
                <DropdownItem>
                    Follow Up Time: {PCGActy[PCGActy.length] = pcg.PCGFLLUP_TIME_HOURS.toFixed(2)}
                </DropdownItem>
                <DropdownItem>
                    New Alert Time:{" "}
                    {PCGActy[PCGActy.length] = pcg.PCGNEWALERT_TIME_HOURS.toFixed(2)}
                </DropdownItem>
                <DropdownItem>
                    Reference Time: {PCGActy[PCGActy.length] = pcg.PCGREF_TIME_HOURS.toFixed(2)}
                </DropdownItem>
                <DropdownItem>
                    Term Time: {PCGActy[PCGActy.length] = pcg.PCGTERM_TIME_HOURS.toFixed(2)}
                </DropdownItem>
                <DropdownItem>
                    EMPGRP Time: {PCGActy[PCGActy.length] = pcg.PCGEMPGRP_TIME_HOURS.toFixed(2)}
                </DropdownItem>
                <DropdownItem>
                    <GraphForPCG cmp={PCGcmp} data={PCGActy} podId={pod_key}/>
                </DropdownItem>
                <DropdownItem>
                    <GraphForMonthPCG gpsOfClients={gpsOfClients} podId={pod_key}/>
                </DropdownItem>
            </Dropdown.Menu>
        </Dropdown>

        {/* Dropdown button for PSR  */}
        <Dropdown>
        <Dropdown.Toggle
          id="total_time_dropdown"
          style={dropdownButtonStyle}
        >
        <label id={"total_psr_"+pod_key.toString()}>
          {"PSR All Time Hours: " +
            (psr.PRED_PHONE_VOLUME * 7.68 / 60).toFixed(2)}
        </label>
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ width: "100%" }}>
          <DropdownItem>
            <b>More Information: </b>
          </DropdownItem>
          <DropdownItem>
            Percentage of predicted total PSR phone calls:
            {" " + psr.PERC_TOTAL_PSR_PHONE.toFixed(2) * 100 + "%"}
          </DropdownItem>
        </Dropdown.Menu>
      </Dropdown>
      </>
    )
}

export default DropdownButton;