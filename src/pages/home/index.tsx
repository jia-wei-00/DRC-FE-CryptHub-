import React from "react";
import Chart from "./chart";
import Action from "./Action";
import "../../styles/pages/home.scss";
import Testing from "./testing";

const Home = () => {
  const [currency, setCurrency] = React.useState("cryBTCUSD");

  // cryETHUSD

  return (
    <div className="wrapper container">
      {/* <div className="chart-column">
        <Chart currency={currency} />
      </div> */}
      <Testing />
      <div className="action-column">
        <Action currency={currency} setcurrency={setCurrency} />
      </div>
    </div>
  );
};

export default Home;
