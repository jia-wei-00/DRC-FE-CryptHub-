import React, { useRef } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { apiStore } from "../../stores";
import { observer } from "mobx-react-lite";

// The wrapper exports only a default component that at the same time is a
// namespace for the related Props interface (HighchartsReact.Props) and
// RefObject interface (HighchartsReact.RefObject). All other interfaces
// like Options come from the Highcharts module itself.

// React supports function components as a simple way to write components that
// only contain a render method without any state (the App component in this
// example).

const Chart = (props: HighchartsReact.Props) => {
  const options: Highcharts.Options = {
    chart: {
      events: {
        // load: function () {
        //   // set up the updating of the chart each second
        //   var series = this.series[0];
        //   setInterval(function () {
        //     var x = new Date().getTime(), // current time
        //       y = Math.round(Math.random() * 100);
        //     series.addPoint([x, y], true, true);
        //   }, 1000);
        // },
      },
    },
    navigator: {
      enabled: true,
    },
    accessibility: {
      enabled: false,
    },

    time: {
      useUTC: false,
    },

    rangeSelector: {
      buttons: [
        {
          count: 1,
          type: "minute",
          text: "1M",
        },
        {
          count: 5,
          type: "minute",
          text: "5M",
        },
        {
          type: "all",
          text: "All",
        },
      ],
      inputEnabled: false,
      selected: 0,
    },

    title: {
      text: "Live random data",
    },

    exporting: {
      enabled: false,
    },

    series: [
      {
        type: "line",
        data: (function () {
          // generate an array of random data
          var data = [],
            time = new Date().getTime(),
            i;

          for (i = -999; i <= 0; i += 1) {
            data.push([time + i * 1000, Math.round(Math.random() * 100)]);
          }
          console.log(data);
          return data;
        })(),
      },
    ],
  };

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      constructorType={"stockChart"}
      navigator={true}
      ref={chartComponentRef}
      {...props}
    />
  );
};

export default observer(Chart);
