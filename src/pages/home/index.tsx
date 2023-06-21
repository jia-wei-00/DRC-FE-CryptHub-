import React from "react";
import Chart from "./chart";
import Action from "./action";
import "../../styles/pages/home.scss";
import { apiStore } from "../../stores";

const Home = () => {
  const [currency, setCurrency] = React.useState("cryBTCUSD");

  React.useEffect(() => {
    apiStore.subscribeTicks(currency);
  }, []);

  // cryETHUSD

  return (
    <div className="container">
      <Chart />

      <div className="action-column">
        <Action currency={currency} setcurrency={setCurrency} />
      </div>
    </div>
  );
};

export default Home;
