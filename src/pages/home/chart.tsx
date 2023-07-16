import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { websocketStore, modeStore } from "../../stores";
import { observer } from "mobx-react-lite";
import { Loading } from "../../components";

const Chart: React.FC = () => {
  React.useEffect(() => {
    if (
      websocketStore.chart_data.length === 0 &&
      websocketStore.candlesticks.length === 0
    ) {
      websocketStore.subscribeTicks();
    }
  }, [websocketStore.subscribe_currency]);

  const candlestickData = websocketStore.candlesticks.map((candle) => ({
    x: candle.epoch! * 1000,
    ...(websocketStore.chart_type === "line" && { y: candle.close }),
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  }));

  const options: Highcharts.Options = {
    chart: {
      backgroundColor: "transparent",
    },
    tooltip: {
      pointFormat:
        websocketStore.interval === "1t"
          ? '<span style="color:{point.color}">\u25CF</span> {series.name}<br/>' +
            "Spot Price: <b>{point.y}</b><br/>"
          : '<span style="color:{point.color}">\u25CF</span> {series.name}<br/>' +
            "Open: <b>{point.open}</b><br/>" +
            "High: <b>{point.high}</b><br/>" +
            "Low: <b>{point.low}</b><br/>" +
            "Close: <b>{point.close}</b><br/>",
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
          websocketStore.chart_type === "line"
            ? modeStore.mode === "dark"
              ? "white"
              : "#a27b5c"
            : "red",

        upColor: modeStore.mode === "dark" ? "lightgreen" : "green",
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
          <Loading height={"50px"} width={"50px"} />
        </div>
      ) : (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          constructorType={"stockChart"}
          id="chart-tour"
        />
      )}
    </>
  );
};

export default observer(Chart);
