import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React from "react";
import { apiStore } from "../../stores";
import { observer } from "mobx-react-lite";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import "../../styles/components/action.scss";
import { CandlestickChart, Timeline } from "@mui/icons-material";

const Action: React.FC = () => {
  const handleChangeChart = (
    event: React.MouseEvent<HTMLElement>,
    type: string
  ) => {
    if (type === null) return;
    apiStore.setChartType(type);
  };

  const handleChangeInterval = (
    event: React.MouseEvent<HTMLElement>,
    interval: string
  ) => {
    if (interval === null) return;
    apiStore.changeSubscribedInterval(interval);
  };

  const chart = [
    <ToggleButton value="line" key="line">
      <Timeline />
      Line
    </ToggleButton>,
    <ToggleButton
      value="candle"
      key="candle"
      disabled={apiStore.interval === "1t"}
    >
      <CandlestickChart />
      Candle
    </ToggleButton>,
  ];

  const interval = [
    <ToggleButton value="1t" key="1t" disabled={apiStore.chart_type !== "line"}>
      1 tick
    </ToggleButton>,
    <ToggleButton value="1m" key="1m">
      1 minute
    </ToggleButton>,
    <ToggleButton value="30m" key="30m">
      30 minute
    </ToggleButton>,
    <ToggleButton value="1h" key="1h">
      1 hour
    </ToggleButton>,
    <ToggleButton value="1d" key="1d">
      1 day
    </ToggleButton>,
  ];

  const controlChart = {
    value: apiStore.chart_type,
    onChange: handleChangeChart,
    exclusive: true,
  };

  const controlInterval = {
    value: apiStore.interval,
    onChange: handleChangeInterval,
    exclusive: true,
  };

  let before_previous_price = 0;
  let previous_price = 0;
  let current_price = 0;

  if (apiStore.chart_data.length > 10) {
    before_previous_price =
      apiStore.chart_data[apiStore.chart_data.length - 3].price;
    previous_price = apiStore.chart_data[apiStore.chart_data.length - 2].price;
    current_price = apiStore.chart_data[apiStore.chart_data.length - 1].price;
  }

  return (
    <>
      {apiStore.chart_data.length > 0 && (
        <>
          <FormControl sx={{ display: "flex" }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Currency
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={apiStore.subscribe_currency}
              onChange={(e) => {
                apiStore.changeSubscribedCurrency(e.target.value);
              }}
              label="Currency"
            >
              <MenuItem value="BTC">BTC</MenuItem>
              <MenuItem value="ETH">ETH</MenuItem>
            </Select>
          </FormControl>

          <div className="chart">
            Chart Types
            <ToggleButtonGroup {...controlChart} aria-label="Medium sizes">
              {chart}
            </ToggleButtonGroup>
          </div>

          <div className="chart">
            Time Interval
            <ToggleButtonGroup
              {...controlInterval}
              aria-label="Medium sizes"
              sx={{ flexWrap: "wrap" }}
            >
              {interval}
            </ToggleButtonGroup>
          </div>

          <div className="d-flex">
            <div className="price-items">
              <span>Previous Price: </span>
              <span
                className={`d-flex align-center mr-5 ${
                  previous_price > before_previous_price ? "green" : "red"
                }`}
              >
                ${previous_price}
                {previous_price > before_previous_price ? (
                  <TrendingUpIcon />
                ) : (
                  <TrendingDownIcon />
                )}
              </span>
            </div>

            <div className="price-items">
              <span>Current Price:</span>
              <span
                className={`d-flex align-center ${
                  current_price > previous_price ? "green" : "red"
                }`}
              >
                ${current_price}{" "}
                {current_price > previous_price ? (
                  <TrendingUpIcon />
                ) : (
                  <TrendingDownIcon />
                )}
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default observer(Action);
