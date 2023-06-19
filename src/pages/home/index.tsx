import React from "react";
import Chart from "./chart";
import Action from "./action";
import "../../styles/pages/home.scss";
import Testing from "./testing";
import FinancialChart from "./finantial-charts";

const Home = () => {
  const [currency, setCurrency] = React.useState("cryBTCUSD");

  // cryETHUSD

  return (
    <div className="wrapper container">
      {/* <div className="chart-column">
        <Chart currency={currency} />
      </div> */}
      {/* <FinancialChart data={financialData} width={800} height={400} ratio={1} /> */}
      {/* <Testing /> */}
      <FinancialChart />
      <div className="action-column">
        <Action currency={currency} setcurrency={setCurrency} />
      </div>
    </div>
  );
};

export default Home;
