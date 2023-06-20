import React from "react";
import Chart from "./chart";
import Action from "./action";
import "../../styles/pages/home.scss";
import Testing from "./testing";
import CategoryChartHighFrequency from "./financial-charts";
import { apiStore } from "../../stores";
import FinancialCharts from "./financial-charts";
import NumericAxisStockChart from "./chart";

const Home = () => {
  const [currency, setCurrency] = React.useState("cryBTCUSD");

  React.useEffect(() => {
    apiStore.subscribeTicks(currency);
  }, []);

  // cryETHUSD

  return (
    <div className="container">
      {/* <FinancialChart data={financialData} width={800} height={400} ratio={1} /> */}
      {/* <Testing /> */}
      {/* <div style={{ height: "200vh" }}> */}
      {/* <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 0 }}> */}
      <NumericAxisStockChart />
      {/* <CategoryChartHighFrequency /> */}
      {/* </div>
      </div> */}

      {/* <div className="action-column">
        <Action currency={currency} setcurrency={setCurrency} />
      </div> */}
    </div>
  );
};

export default Home;
