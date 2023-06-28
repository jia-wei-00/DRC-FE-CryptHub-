import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React from "react";
import { websocketStore } from "../../stores";
import { observer } from "mobx-react-lite";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import "../../styles/components/action.scss";
import {
  CandlestickChart,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Timeline,
  TrendingFlat,
} from "@mui/icons-material";
import BuySellBox from "./buy-sell-box";

const Action: React.FC = () => {
  const [openDetails, setOpenDetails] = React.useState<boolean>(false);

  let before_previous_price = 0;
  let previous_price = 0;
  let current_price = 0;

  //function for change chart type
  const handleChangeChart = (
    event: React.MouseEvent<HTMLElement>,
    type: string
  ) => {
    if (type === null) return;
    websocketStore.setChartType(type);
  };

  //function for change chart interval
  const handleChangeInterval = (
    event: React.MouseEvent<HTMLElement>,
    interval: string
  ) => {
    if (interval === null) return;
    websocketStore.changeSubscribedInterval(interval);
  };

  //toggle button for chart type
  const chart = [
    <ToggleButton value="line" key="line">
      <Timeline />
      Line
    </ToggleButton>,
    <ToggleButton
      value="candles"
      key="candles"
      disabled={websocketStore.interval === "1t"}
    >
      <CandlestickChart />
      Candle
    </ToggleButton>,
  ];

  //toggle button for chart interval
  const interval = [
    <ToggleButton
      value="1t"
      key="1t"
      disabled={websocketStore.chart_type !== "line"}
    >
      1 tick
    </ToggleButton>,
    <ToggleButton value="60" key="1m">
      1 minute
    </ToggleButton>,
    <ToggleButton value="1800" key="30m">
      30 minute
    </ToggleButton>,
    <ToggleButton value="3600" key="1h">
      1 hour
    </ToggleButton>,
    <ToggleButton value="86400" key="1d">
      1 day
    </ToggleButton>,
  ];

  //chart type props settings
  const controlChart = {
    value: websocketStore.chart_type,
    onChange: handleChangeChart,
    exclusive: true,
  };

  //chart interval props settings
  const controlInterval = {
    value: websocketStore.interval,
    onChange: handleChangeInterval,
    exclusive: true,
  };

  let current_candles = {
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  };
  let previous_candles = {
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  };

  //get price for ticks
  if (websocketStore.chart_data.length > 0) {
    before_previous_price =
      websocketStore.chart_data[websocketStore.chart_data.length - 3].price;
    previous_price =
      websocketStore.chart_data[websocketStore.chart_data.length - 2].price;
    current_price =
      websocketStore.chart_data[websocketStore.chart_data.length - 1].price;
  }

  //get price for chart with interval
  if (websocketStore.ohlc.length > 1) {
    previous_candles = {
      open: websocketStore.candlesticks[websocketStore.candlesticks.length - 2]
        .open,
      high: websocketStore.candlesticks[websocketStore.candlesticks.length - 2]
        .high,
      low: websocketStore.candlesticks[websocketStore.candlesticks.length - 2]
        .low,
      close:
        websocketStore.candlesticks[websocketStore.candlesticks.length - 2]
          .close,
    };
    current_candles = {
      open: websocketStore.ohlc[websocketStore.ohlc.length - 1].open,
      high: websocketStore.ohlc[websocketStore.ohlc.length - 1].high,
      low: websocketStore.ohlc[websocketStore.ohlc.length - 1].low,
      close: websocketStore.ohlc[websocketStore.ohlc.length - 1].close,
    };
  }

  return (
    <div className="side-bar">
      <div className="side-bar-details">
        <div className="mobile-hide">
          <FormControl sx={{ display: "flex" }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Currency
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={websocketStore.subscribe_currency}
              onChange={(e) => {
                websocketStore.changeSubscribedCurrency(e.target.value);
              }}
              label="Currency"
            >
              <MenuItem value="BTC">BTC</MenuItem>
              <MenuItem value="ETH">ETH</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="chart mobile-hide">
          Chart Types
          <ToggleButtonGroup
            {...controlChart}
            aria-label="Medium sizes"
            className="button-group"
          >
            {chart}
          </ToggleButtonGroup>
        </div>

        <div className="chart mobile-hide">
          Time Interval
          <ToggleButtonGroup
            {...controlInterval}
            aria-label="Medium sizes"
            className="button-group"
            sx={{ flexWrap: "wrap" }}
          >
            {interval}
          </ToggleButtonGroup>
        </div>

        {websocketStore.chart_data.length > 0 && (
          <div className="details">
            <div
              className="arrow-up"
              onClick={() => setOpenDetails(!openDetails)}
            >
              {openDetails ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </div>
            <div className={`ohlc ${openDetails && "show"}`}>
              <div className="price-items">
                <span>Previous Price: </span>
                <span
                  className={`d-flex align-center mr-5 ${
                    previous_price > before_previous_price
                      ? "green"
                      : previous_price < before_previous_price && "red"
                  }`}
                >
                  ${previous_price}
                  {previous_price > before_previous_price ? (
                    <TrendingUpIcon />
                  ) : previous_price < before_previous_price ? (
                    <TrendingDownIcon />
                  ) : (
                    <TrendingFlat />
                  )}
                </span>
              </div>

              <div className="price-items">
                <span>Current Price:</span>
                <span
                  className={`d-flex align-center ${
                    current_price > previous_price
                      ? "green"
                      : current_price < previous_price && "red"
                  }`}
                >
                  ${current_price}
                  {current_price > previous_price ? (
                    <TrendingUpIcon />
                  ) : current_price < previous_price ? (
                    <TrendingDownIcon />
                  ) : (
                    <TrendingFlat />
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {websocketStore.interval !== "1t" && websocketStore.ohlc.length > 1 && (
          <div className="details">
            <div
              className="arrow-up"
              onClick={() => setOpenDetails(!openDetails)}
            >
              {openDetails ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </div>

            <div className={`ohlc ${openDetails && "show"}`}>
              <div className="price-items">
                <span>Open:</span>
                <span
                  className={`d-flex align-center ${
                    current_candles.open > previous_candles.open
                      ? "green"
                      : current_candles.open < previous_candles.open && "red"
                  }`}
                >
                  ${current_candles.open}
                  {current_candles.open > previous_candles.open ? (
                    <TrendingUpIcon />
                  ) : current_candles.open < previous_candles.open ? (
                    <TrendingDownIcon />
                  ) : (
                    <TrendingFlat />
                  )}
                </span>
              </div>
              <div className="price-items">
                <span>High:</span>
                <span
                  className={`d-flex align-center ${
                    current_candles.high > previous_candles.high
                      ? "green"
                      : current_candles.high < previous_candles.high && "red"
                  }`}
                >
                  ${current_candles.high}
                  {current_candles.high > previous_candles.high ? (
                    <TrendingUpIcon />
                  ) : current_candles.high < previous_candles.high ? (
                    <TrendingDownIcon />
                  ) : (
                    <TrendingFlat />
                  )}
                </span>
              </div>
              <div className="price-items">
                <span>Low:</span>
                <span
                  className={`d-flex align-center ${
                    current_candles.low > previous_candles.low
                      ? "green"
                      : current_candles.low < previous_candles.low && "red"
                  }`}
                >
                  ${current_candles.low}
                  {current_candles.low > previous_candles.low ? (
                    <TrendingUpIcon />
                  ) : current_candles.low < previous_candles.low ? (
                    <TrendingDownIcon />
                  ) : (
                    <TrendingFlat />
                  )}
                </span>
              </div>
              <div className="price-items">
                <span>Close:</span>
                <span
                  className={`d-flex align-center ${
                    current_candles.close > previous_candles.close
                      ? "green"
                      : current_candles.close < previous_candles.close && "red"
                  }`}
                >
                  ${current_candles.close}
                  {current_candles.close > previous_candles.close ? (
                    <TrendingUpIcon />
                  ) : current_candles.close < previous_candles.close ? (
                    <TrendingDownIcon />
                  ) : (
                    <TrendingFlat />
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <BuySellBox
        current_price={current_price}
        current_candles={current_candles}
      />
    </div>
  );
};

export default observer(Action);
