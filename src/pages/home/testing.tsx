import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { apiStore, authStore } from "../../stores";
import { observer } from "mobx-react-lite";

const Testing = () => {
  React.useEffect(() => {
    apiStore.subscribeTicks("cryBTCUSD");
  });

  return (
    <LineChart
      width={1200}
      height={700}
      data={apiStore.chart_data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
      style={{ color: "black" }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis type="number" domain={["auto", "auto"]} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="price" stroke="#82ca9d" strokeWidth={2} />
    </LineChart>
  );
};

export default observer(Testing);
