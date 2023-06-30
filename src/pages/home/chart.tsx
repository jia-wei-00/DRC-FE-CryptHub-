import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { websocketStore, modeStore } from "../../stores";
import { observer } from "mobx-react-lite";
import ReactLoading from "react-loading";

const Chart: React.FC = () => {
  React.useEffect(() => {
    if (
      websocketStore.chart_data.length === 0 &&
      websocketStore.candlesticks.length === 0
    ) {
      websocketStore.subscribeTicks();
    }

    // return () => {
    //   websocketStore.unsubscribeTicks();
    // };
  }, [websocketStore.subscribe_currency]);

  const candlestickData = websocketStore.candlesticks.map((candle) =>
    websocketStore.chart_type === "line"
      ? [candle.epoch! * 1000, candle.close]
      : {
          x: candle.epoch! * 1000,
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
      websocketStore.interval === "1t" ||
      websocketStore.chart_type === "candles"
        ? {}
        : {
            shared: true,
            formatter: function () {
              const index = this.point.index; // Accessing the index of the data point

              const data = websocketStore.candlesticks[index];

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
      text: websocketStore.subscribe_currency,
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
        enabled: true,
        style: {
          color: modeStore.mode === "dark" ? "white" : "",
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
        turboThreshold: 5000,
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: `${websocketStore.subscribe_currency} / USD`,
        type: websocketStore.chart_type === "line" ? "line" : "candlestick",
        color:
          modeStore.mode === "dark"
            ? websocketStore.chart_type === "line"
              ? "white"
              : "grey"
            : "#A27B5C",
        data:
          websocketStore.interval === "1t"
            ? websocketStore.chart_data.map((item) => [
                item.time * 1000,
                item.price,
              ])
            : candlestickData,
      },
    ],
  };

  return (
    <>
      {websocketStore.chart_data.length === 0 &&
      websocketStore.candlesticks.length === 0 ? (
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
    </>
  );
};

export default observer(Chart);
