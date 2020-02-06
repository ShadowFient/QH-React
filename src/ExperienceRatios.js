import React, { useEffect, useState } from "react";
import ExperienceRatio from "./ExperienceRatio";
import CardColumns from 'react-bootstrap/CardColumns';

const ExperienceRatios = props => {
    const [pod_ids, setPodIds] = useState();
    let experience_ratios;
    useEffect(() => {
        const fetchPodIds = async () => {
          try {
            const response = await fetch(
              "http://localhost:5000/get_pod_ids"
            );
            const responseData = await response.json();
            // console.log(responseData.ids);
            setPodIds(responseData.ids);
            if (!response.ok) {
              throw new Error(responseData.message);
            }
            
          } catch (err) {
            console.log(err);
          }
        };
        fetchPodIds();
      }, []);

    if (pod_ids && pod_ids.length > 0) {
        experience_ratios = pod_ids.map(pod_id => {
          return <ExperienceRatio id={pod_id} key={pod_id} />;
        });
    }

  return <CardColumns>{experience_ratios}</CardColumns>;
};

export default ExperienceRatios;
