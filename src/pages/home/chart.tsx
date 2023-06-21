import React, { useRef } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { apiStore, modeStore } from "../../stores";
import { observer } from "mobx-react-lite";

const Chart = () => {
  const options: Highcharts.Options = {
    chart: {
      height: "800px",
      backgroundColor: "transparent",
    },
    navigator: {
      enabled: true,
      maskFill:
        modeStore.mode === "dark"
          ? "rgba(255,255,255,0.3)"
          : "rgba(162, 123, 92, 0.3)",
    },
    accessibility: {
      enabled: false,
    },
    time: {
      useUTC: false,
    },
    title: {
      text: "ETH",
      style: {
        color: modeStore.mode === "dark" && "white",
      },
    },
    exporting: {
      enabled: false,
    },
    rangeSelector: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      // max: apiStore.chart_data[apiStore.chart_data.length - 1].time + 60 * 1000,
      labels: {
        style: {
          color: modeStore.mode === "dark" && "white",
          gridLines: {
            zeroLineColor: modeStore.mode === "dark" && "white",
          },
        },
      },
    },
    yAxis: {
      gridLineColor: modeStore.mode === "dark" ? "grey" : "lightgrey",
      labels: {
        style: {
          color: modeStore.mode === "dark" && "white",
        },
        formatter: function () {
          return "$" + this.value;
        },
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "ETH / USD",
        type: "line",
        color: modeStore.mode === "dark" ? "white" : "#A27B5C",
        data: apiStore.chart_data.map((item) => [item.time * 1000, item.price]),
      },
    ],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      constructorType={"stockChart"}
    />
  );
};

export default observer(Chart);
