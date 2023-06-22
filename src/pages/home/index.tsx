import React from "react";
import Chart from "./chart";
import Action from "./action";
import "../../styles/pages/home.scss";

const Home = () => {
  return (
    <div className="container">
      <Chart />
      <div className="action-column">
        <Action />
      </div>
    </div>
  );
};

export default Home;
