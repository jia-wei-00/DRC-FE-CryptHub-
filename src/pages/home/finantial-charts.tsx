import React from "react";
import {
  ChartCanvas,
  Chart,
  series,
  scale,
  coordinates,
  tooltip,
  axes,
  helper,
} from "react-financial-charts";
import { apiStore } from "../../stores";

interface ChartDataPoint {
  price: number;
  time: string;
}

interface ChartProps {
  data: ChartDataPoint[];
}

const FinancialChart: React.FC<ChartProps> = () => {
  const xScaleProvider = new scale.DateScaleProvider();
  const {
    data: chartData,
    xScale,
    xAccessor,
    displayXAccessor,
  } = xScaleProvider.evaluate(apiStore.chart_data);

  const margin = { left: 50, right: 50, top: 10, bottom: 30 };
  const height = 400;

  const yExtents = (d: ChartDataPoint) => [d.price];

  return (
    <ChartCanvas
      height={height}
      width={800}
      margin={margin}
      data={chartData}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
    >
      <Chart id={1} yExtents={yExtents}>
        <series.LineSeries
          yAccessor={yExtents}
          strokeStyle="rgba(75,192,192,1)"
        />
        <axes.XAxis />
        <axes.YAxis />
        <coordinates.MouseCoordinateX />
        <coordinates.MouseCoordinateY />
        <tooltip.Tooltip
          origin={[0, 0]}
          yAccessor={yExtents}
          tooltipContent={(displayXValue: any, displayYValue: any) => ({
            x: displayXValue,
            y: displayYValue,
          })}
        />
      </Chart>
    </ChartCanvas>
  );
};

export default FinancialChart;
