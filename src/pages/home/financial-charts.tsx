import React from "react";
import { IgrFinancialChart } from "igniteui-react-charts";
import { IgrFinancialChartModule } from "igniteui-react-charts";
import { observer } from "mobx-react-lite";
import { apiStore } from "../../stores";

IgrFinancialChartModule.register();

const FinancialChartMultipleData = () => {
  return (
    <div className="container sample">
      <div className="container" style={{ height: "calc(100% - 25px)" }}>
        <IgrFinancialChart
          width="100%"
          height="100%"
          chartType="Line"
          thickness={2}
          chartTitle="BTC"
          subtitle="Between 2013 and 2017"
          yAxisMode="Numeric"
          yAxisTitle="Price"
          dataSource={apiStore.chart_data}
        />
      </div>
    </div>
  );
};

export default observer(FinancialChartMultipleData);
