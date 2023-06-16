import React from "react";
import Chart from "./chart";

const Home = () => {
  const [currency, setcurrency] = React.useState("cryBTCUSD");

  // cryETHUSD

  return (
    <div>
      <Chart currency={currency} />
    </div>
  );
};

export default Home;
