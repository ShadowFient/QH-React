/* eslint-disable */
import React, { useEffect, useState } from "react";
import Slider from "@material-ui/core/Slider";
import { Container, Row, Col } from "reactstrap";

import "./PredictFTEwithExpRatio.css";

const marks = [
  {
    value: 0,
    label: "Experienced"
  },
  {
    value: 100,
    label: "New"
  }
];

const PredictPsrFTEWithExpRatio = props => {
  const {
    index,
    initExperienceRatio,
    ratioChangeHandler,
    isPcgRatio,
    capacity,
    allInputFTE,
    updateInputFTE,
    allPredictFTE,
    updatePredictFTE,
    psrTime
  } = props;
  const MonthCap1 = 0.76;
  const MonthCap2 = 0.83;
  const MonthCap3 = 0.88;
  const MonthCap4 = 0.9;
  const MonthCap5 = 0.92;
  const MonthCap6 = 0.96;

  const [ratio, setRatio] = useState(initExperienceRatio);
  const [curFTE, setCurFTE] = useState(0);
  const [predictFTE, setPredictFTE] = useState(0);
  const FTE_per_month = (capacity || 1570) / 12;

  useEffect(() => {
    /**
     * From month 1 to 6,
     * Sum of [(exp_ratio)*(predictedFTE)*(FTE_per_month)*(MonthCap)
     *             + (1-exp_ratio)*(predictedFTE)*(FTE_per_month)] = psrTime
     *
     * After 6 months,
     * Sum of (FTE_per_month * predictedFTE) = psrTime
     *
     */
    // let source = document.getElementById("total_psr_" + index).innerText;
    let source = psrTime || document.getElementById("total_psr_" + index).innerText;
    let sourcePsr = source.slice(20, source.length);
    const predictedFTE =
      sourcePsr /
      FTE_per_month /
      (12 +
        ratio *
          (MonthCap1 +
            MonthCap2 +
            MonthCap3 +
            MonthCap4 +
            MonthCap5 +
            MonthCap6 -
            6));
    document.getElementById("pod" + index + "PsrFte").innerText =
      "Predicted FTEs: " + predictedFTE.toFixed(2).toString();
    setPredictFTE(preFTE => {
      const newFTE = parseFloat(predictedFTE.toFixed(2));
      updatePredictFTE(prev => {
        return parseFloat((prev - preFTE + newFTE).toFixed(2));
      });
      return newFTE;
    });
  }, [ratio, FTE_per_month, index, allPredictFTE, psrTime, updatePredictFTE]);

  const formatValueText = value => {
    return `${value}%`;
  };

  const sliderHandler = (event, value) => {
    event.preventDefault();
    const changedRatio = value / 100;
    setRatio(changedRatio);
    ratioChangeHandler(isPcgRatio, index, changedRatio);
  };

  const changeFTE = event => {
    event.preventDefault();
    let newFTE = event.target.value === "" ? 0 : parseFloat(event.target.value);
    let updatedTotalFTE = allInputFTE;
    setCurFTE(preFTE => {
      updatedTotalFTE = allInputFTE - preFTE + newFTE;
      updateInputFTE(updatedTotalFTE);
      return newFTE;
    });
  };

  return (
    <Container>
      <Row>
        <b>PSR</b>
      </Row>
      <Row>
        <Col id={"pod" + index + "PsrFte"}></Col>
        <Col>
          Input FTEs:
          <input
            className={"input_psr_fte"}
            type={"number"}
            style={{
              maxWidth: "60px",
              lineHeight: "normal",
              marginLeft: "10px"
            }}
            min={0}
            onChange={changeFTE}
          ></input>
        </Col>
        <Slider
          style={{ color: "#fcd406", marginBottom: "25px" }}
          defaultValue={20}
          onChangeCommitted={sliderHandler}
          min={0}
          step={1}
          max={100}
          marks={marks}
          valueLabelDisplay="auto"
          valueLabelFormat={formatValueText}
        />
      </Row>
    </Container>
  );
};

export default PredictPsrFTEWithExpRatio;
