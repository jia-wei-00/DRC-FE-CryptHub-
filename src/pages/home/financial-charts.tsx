import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-stockcharts";
import { observer } from "mobx-react-lite";
import { apiStore } from "../../stores";

interface DataPoint {
  x: number;
  y: number;
}

interface AppState {
  options: {
    title: {
      text: string;
    };
    animationEnabled: boolean;
    exportEnabled: boolean;
    charts: {
      axisX: {
        crosshair: {
          enabled: boolean;
          snapToDataPoint: boolean;
        };
      };
      axisY: {
        crosshair: {
          enabled: boolean;
        };
      };
      data: {
        type: string;
        dataPoints: DataPoint[];
      }[];
    }[];
    rangeSelector: {
      inputFields: {
        startValue: number;
        endValue: number;
        valueFormatString: string;
      };
      buttons: {
        label: string;
        range: number;
        rangeType: string;
      }[];
    };
  };
}

const FinancialChart: React.FC<{}> = () => {
  const generateDataPoints = (noOfDps: number): DataPoint[] => {
    let xVal = 1;
    let yVal = 100;
    const dps: DataPoint[] = [];
    for (let i = 0; i < noOfDps; i++) {
      yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
      dps.push({ x: xVal, y: yVal });
      xVal++;
    }
    return dps;
  };

  const options = {
    title: {
      text: "React StockChart with Numeric Axis",
    },
    animationEnabled: false,
    exportEnabled: true,
    charts: [
      {
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
          },
        },
        axisY: {
          crosshair: {
            enabled: true,
          },
        },
        data: [
          {
            type: "spline",
            dataPoints: apiStore.chart_data,
          },
        ],
      },
    ],
    rangeSelector: {
      inputFields: {
        startValue: 4000,
        endValue: 6000,
        valueFormatString: "###0",
      },
      buttons: [
        {
          label: "1000",
          range: 1000,
          rangeType: "number",
        },
        {
          label: "2000",
          range: 2000,
          rangeType: "number",
        },
        {
          label: "5000",
          range: 5000,
          rangeType: "number",
        },
        {
          label: "All",
          rangeType: "all",
        },
      ],
    },
  };

  // useEffect(() => {
  //   console.log(generateDataPoints(1000));

  //   const generateDataPoints = (noOfDps: number): DataPoint[] => {
  //     let xVal = 1;
  //     let yVal = 100;
  //     const dps: DataPoint[] = [];
  //     for (let i = 0; i < noOfDps; i++) {
  //       yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
  //       dps.push({ x: xVal, y: yVal });
  //       xVal++;
  //     }
  //     return dps;
  //   };
  // }, []);

  const containerProps = {
    width: "100%",
    height: "450px",
    margin: "auto",
  };

  return (
    <div>
      <div>
        <CanvasJSReact.CanvasJSStockChart
          containerProps={containerProps}
          options={options}
        />
      </div>
    </div>
  );
};

export default observer(FinancialChart);
