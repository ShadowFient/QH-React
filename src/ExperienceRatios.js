import React, { useEffect, useState } from "react";
import ExperienceRatio from "./ExperienceRatio";
import CardColumns from "react-bootstrap/CardColumns";
import Spinner from "react-bootstrap/Spinner";

const ExperienceRatios = props => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  let experience_ratios;
  useEffect(() => {
    const fetchPodIds = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/fetch_data");
        const responseData = await response.json();
        // console.log(responseData.data);
        console.log(responseData);
        // setData(responseData.data);
        if (!response.ok) {
          throw new Error(responseData.message);
        }
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchPodIds();
  }, []);

  if (data && data.length > 0) {
    experience_ratios = data.map(dataItem => {
      return <ExperienceRatio key={dataItem[0]} id={dataItem[0]} ratio={dataItem[1]} isLoading={isLoading} />;
    });
  }


  if (isLoading) {
    experience_ratios =(
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
    );
  } else {
      experience_ratios = <CardColumns>{experience_ratios}</CardColumns>;
  }

  return (
    <>
      {experience_ratios}
    </>
  );
};

export default ExperienceRatios;
