import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { apiStore } from "../../stores";
import { observer } from "mobx-react-lite";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart: React.FC<{ currency: string }> = (props) => {
  const labels = apiStore.t_chart_labels;

  console.log(labels);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: props.currency === "cryBTCUSD" ? "BTC" : "ETH",
      },
    },
    scales: {
      y: {
        // beginAtZero: true,
        title: {
          display: true,
          text: "USD",
        },
      },
      x: {
        title: {
          display: true,
          text: "TIME",
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "BTC",
        data: apiStore.t_chart_data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  React.useEffect(() => {
    apiStore.subscribeTicks(props.currency);
  }, [props.currency]);

  return <Line options={options} data={data} />;
};

export default observer(Chart);
