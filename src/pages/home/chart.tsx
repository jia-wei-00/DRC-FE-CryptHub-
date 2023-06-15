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
import { faker } from "@faker-js/faker";
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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    // title: {
    //   display: true,
    //   text: "Chart.js Line Chart",
    // },
  },
};

const Chart: React.FC = () => {
  const labels = apiStore.chart_labels;

  const data = {
    labels,
    datasets: [
      {
        data: apiStore.chart_data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      // {
      //   label: "ETH",
      //   data: apiStore.chart_data_eth,
      //   borderColor: "rgb(255, 99, 132)",
      //   backgroundColor: "rgba(255, 99, 132, 0.5)",
      // },
    ],
  };

  React.useEffect(() => {
    apiStore.subscribeTicks();
    apiStore.subscribeTicksEth();
  }, []);

  //   console.log(apiStore.chart_data);

  return <Line options={options} data={data} />;
};

export default observer(Chart);
