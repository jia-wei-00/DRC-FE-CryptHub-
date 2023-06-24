import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { apiStore, modeStore } from "../../stores";
import { observer } from "mobx-react-lite";
import ReactLoading from "react-loading";
import Action from "./action";

const Chart: React.FC = () => {
  React.useEffect(() => {
    apiStore.subscribeTicks();

    return () => {
      apiStore.unsubscribeTicks();
    };
  }, [apiStore.subscribe_currency]);

  const candlestickData = apiStore.candlesticks.map((candle) =>
    apiStore.chart_type === "line"
      ? [candle.epoch * 1000, candle.close]
      : {
          x: candle.epoch * 1000,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }
  );

  const options: Highcharts.Options = {
    chart: {
      backgroundColor: "transparent",
    },
    tooltip:
      apiStore.interval === "1t" || apiStore.chart_type === "candles"
        ? {}
        : {
            shared: true,
            formatter: function () {
              const index = this.point.index; // Accessing the index of the data point

              const data = apiStore.candlesticks[index];

              // Generate the tooltip HTML content including the index
              const tooltipContent = `
            Open: ${data.open}<br>
            High: ${data.high}<br>
            Low: ${data.low}<br>
            Close: ${data.close}<br>
          `;

              return tooltipContent;
            },
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
        color:
          modeStore.mode === "dark"
            ? apiStore.chart_type === "line"
              ? "white"
              : "grey"
            : "#A27B5C",
        data:
          apiStore.interval === "1t"
            ? apiStore.chart_data.map((item) => [item.time * 1000, item.price])
            : candlestickData,
      },
    ],
  };

  return (
    <div className="chart-container">
      {apiStore.chart_data.length === 0 &&
      apiStore.candlesticks.length === 0 ? (
        <div className="loading">
          <ReactLoading type="bars" height={"80px"} width={"80px"} />
        </div>
      ) : (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          constructorType={"stockChart"}
        />
      )}
      <div className="action-column">
        <Action />
      </div>
    </div>
  );
};

export default observer(Chart);
