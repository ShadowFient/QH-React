import React, { useEffect, useState } from "react";
import Slider from "@material-ui/core/Slider";
import { Container, Row } from "reactstrap";

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

const PredictPcgFTEwithExpRatio = props => {
  const {
    index,
    initExperienceRatio,
    ratioChangeHandler,
    isPcgRatio,
    capacity
  } = props;
  const MonthCap1 = 0.76;
  const MonthCap2 = 0.83;
  const MonthCap3 = 0.88;
  const MonthCap4 = 0.9;
  const MonthCap5 = 0.92;
  const MonthCap6 = 0.96;
  const [ratio, setRatio] = useState(initExperienceRatio);
  const FTE_per_month = (capacity || 1570) / 12;

  useEffect(() => {
    /**
     * From month 1 to 6,
     * Sum of [(exp_ratio)*(predictedFTE)*(FTE_per_month)*(MonthCap)
     *             + (1-exp_ratio)*(predictedFTE)*(FTE_per_month)] = pcgTime
     *
     * After 6 months,
     * Sum of (FTE_per_month * predictedFTE) = pcgTime
     *
     */
    let source = document.getElementById("total_pcg_"+index).innerText;
    let sourcePcg = source.slice(20,source.length);
    const predictedFTE =
      sourcePcg /
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
    document.getElementById("pod"+index+"PcgFte").innerText = "Predicted FTEs: " + predictedFTE.toFixed(2).toString();
  }, [ratio, FTE_per_month,index]);

  const formatValueText = value => {
    return `${value}%`;
  };

  const sliderHandler = (event, value) => {
    event.preventDefault();
    const changedRatio = value / 100;
    setRatio(changedRatio);
    ratioChangeHandler(isPcgRatio, index, changedRatio);
  };

  // console.log("[PredictPcgFTEwithExpRatio]");

  return (
    <Container>
      <Row>
        <b>PCG</b>
      </Row>
      <Row>
        <p id={"pod"+index+"PcgFte"}></p>
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

// const areEqual = (prevProps, nextProps) => {
//   return prevProps.pcgTime === nextProps.pcgTime;
// };

// export default React.memo(PredictFTEwithExpRatio, areEqual);

export default PredictPcgFTEwithExpRatio;
