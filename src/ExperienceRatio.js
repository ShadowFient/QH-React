import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const ExperienceRatio = props => {
  const { id, ratio, isLoading } = props;

  return (
    <>
      <Card style={{ width: "18rem" }} className="p-3">
        <Card.Img variant="top" />
        <Card.Body>
          <Card.Title>POD {id}</Card.Title>
          <Card.Text>{isLoading ? <span>Loading...</span> : <span>Experience Ratio: {ratio * 100 + "%"}</span>}</Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default ExperienceRatio;
