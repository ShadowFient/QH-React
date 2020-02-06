import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const ExperienceRatio = props => {
  const { id } = props;
  const [ratio, setRatio] = useState();

  useEffect(() => {
    const fetchRatio = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/experience_ratio?pod=" + id
        );
        const responseData = await response.json();
        // console.log(responseData);
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        const percent = responseData.experience_ratio * 100 + "%"
        setRatio(percent);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRatio();
  }, [id]);

  return (
    <Card style={{ width: "18rem" }} className="p-3">
      <Card.Img variant="top" />
      <Card.Body>
        <Card.Title>POD {props.id}</Card.Title>
        <Card.Text>Experience Ratio: {ratio}</Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
};

export default ExperienceRatio;