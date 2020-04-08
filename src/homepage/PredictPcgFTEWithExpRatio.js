/* eslint-disable */
import React, { useEffect, useState } from "react";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import { createMuiTheme , withStyles } from "@material-ui/core/styles";
import { Container, Row } from "reactstrap";
import "./PredictFTEwithExpRatio.css";
import { Col } from "react-bootstrap";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#4CAF50"
		},
		secondary: {
			main: '#fcd406',
		},
	},
});

const CustomizedTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#4CAF50"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#4CAF50"
    }
  }
})(TextField);

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

const PredictPcgFTEWithExpRatio = props => {
  const {
    index,
    initExperienceRatio,
    ratioChangeHandler,
    isPcgRatio,
    capacity,
    allInputFTE,
    updateTotalInputFTE,
    allPredictFTE,
    updateTotalPredictFTE,
    pcgTime,
    pcgInputFTEArray,
    setPcgInputFTEArray
  } = props;
  const MonthCap1 = 0.76;
  const MonthCap2 = 0.83;
  const MonthCap3 = 0.88;
  const MonthCap4 = 0.9;
  const MonthCap5 = 0.92;
  const MonthCap6 = 0.96;

  const [defaultVal, setDefaultVal] = useState(initExperienceRatio);
  const [ratio, setRatio] = useState(initExperienceRatio);
  const [inputFTE, setInputFTE] = useState(0);
  const [predictFTE, setPredictFTE] = useState(0);
  const [initialize, setInitialize] = useState(false);
  const FTE_per_month = (capacity || 1570) / 12;

  console.log("[pcg] rerender");useEffect(() => {
		/**
		 * From month 1 to 6,
		 * Sum of [(exp_ratio)*(predictedFTE)*(FTE_per_month)*(MonthCap)
		 *             + (1-exp_ratio)*(predictedFTE)*(FTE_per_month)] = pcgTime
		 *
		 * After 6 months,
		 * Sum of (FTE_per_month * predictedFTE) = pcgTime
		 *
		 */
		// let source = document.getElementById("total_pcg_" + index).innerText;
		let source =
			pcgTime || document.getElementById("total_pcg_" + index).innerText;
		let sourcePcg = source.slice(20, source.length);
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
		document.getElementById("pod" + index + "PcgFte").innerText =
			"Predicted FTEs: " + predictedFTE.toFixed(2).toString();
		// if (!document.getElementById(index + "_input_pcg_fte").defaultValue) {
    // console.log(document.getElementById(index + "_input_pcg_fte"));
    if (!initialize) {
      document.getElementById(index + "_input_pcg_fte").value = parseFloat(
        predictedFTE.toFixed(2)
      );
      setInitialize(true);
      pcgInputFTEArray[index - 1] = parseFloat(predictedFTE.toFixed(2));
      setPcgInputFTEArray(pcgInputFTEArray);
      setInputFTE(preFTE => {
        const newFTE = parseFloat(predictedFTE.toFixed(2));
        updateTotalInputFTE(prev => {
          // console.log("prevTotal: " + prev + " | prevFTE: " + preFTE + " | " + newFTE);
          let updatedTotalFTE = parseFloat((prev - preFTE + newFTE).toFixed(2));
          return updatedTotalFTE;
        });
        return newFTE;
      });
    }
    // }
    setPredictFTE(preFTE => {
      const newFTE = parseFloat(predictedFTE.toFixed(2));
      updateTotalPredictFTE(prev => {
        return parseFloat((prev - preFTE + newFTE).toFixed(2));
      });
      return newFTE;
    });

  }, [
    ratio,
    FTE_per_month,
    index,
    allPredictFTE,
    pcgTime,
    updateTotalPredictFTE
  ]);

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
    pcgInputFTEArray[index - 1] = parseFloat(newFTE.toFixed(2));
    setPcgInputFTEArray(pcgInputFTEArray);
    let updatedTotalFTE = allInputFTE;
    setInputFTE(preFTE => {
      updatedTotalFTE = allInputFTE - preFTE + newFTE;
      updateTotalInputFTE(updatedTotalFTE);
			return newFTE;
		});
	};

	return (
		<Container>
			<Row>
				<b>PCG</b>
			</Row>
			<Row>
				<Col id={"pod" + index + "PcgFte"} style={{ paddingTop: "10px" }} />
        <Col>
          <CustomizedTextField
            id={index + "_input_pcg_fte"}
            className={"input_pcg_fte"} label={"Input FTE"} min={0} onChange={changeFTE}
						type={"number"} style={{ marginTop: "-15px" }}
						 />
				</Col>
				<Slider
					style={{ color: "#fcd406", marginBottom: "25px" }}
					defaultValue={defaultVal * 100}
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

export default PredictPcgFTEWithExpRatio;
