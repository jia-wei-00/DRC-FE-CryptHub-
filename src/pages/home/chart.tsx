import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { apiStore, modeStore } from "../../stores";
import { observer } from "mobx-react-lite";

const Chart: React.FC = () => {
  React.useEffect(() => {
    apiStore.subscribeTicks();

    return () => {
      apiStore.unsubscribeTicks();
    };
  }, [apiStore.subscribe_currency]);

  const candlestickData = apiStore.candlesticks.map((candle) => ({
    x: candle.epoch * 1000,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  }));

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
      text: apiStore.subscribe_currency,
      style: {
        color: modeStore.mode === "dark" ? "white" : "",
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
      labels: {
        style: {
          color: modeStore.mode === "dark" ? "white" : "",
          gridLines: {
            zeroLineColor: modeStore.mode === "dark" ? "white" : "",
          },
        },
      },
      lineColor: modeStore.mode === "dark" ? "white" : "",
      tickColor: modeStore.mode === "dark" ? "white" : "",
    },
    yAxis: {
      gridLineColor: modeStore.mode === "dark" ? "grey" : "lightgrey",
      labels: {
        style: {
          color: modeStore.mode === "dark" ? "white" : "",
        },
        // formatter: function () {
        //   return "$" + this.value;
        // },
      },
    },
    plotOptions: {
      series: {
        turboThreshold: 5000, // Adjust this value as needed
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: `${apiStore.subscribe_currency} / USD`,
        type: apiStore.chart_type === "line" ? "line" : "candlestick",
        color: modeStore.mode === "dark" ? "grey" : "#A27B5C",
        data:
          apiStore.chart_type === "line"
            ? apiStore.chart_data.map((item) => [item.time * 1000, item.price])
            : candlestickData,
      },
    ],
  };

  return (
    <div className="f-1">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        constructorType={"stockChart"}
      />
    </div>
  );
};

export default observer(Chart);
