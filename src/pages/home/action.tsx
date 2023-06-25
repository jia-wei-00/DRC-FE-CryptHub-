import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React from "react";
import { apiStore } from "../../stores";
import { observer } from "mobx-react-lite";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import "../../styles/components/action.scss";
import {
  Add,
  CandlestickChart,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Remove,
  Timeline,
  TrendingFlat,
} from "@mui/icons-material";

const Action: React.FC = () => {
  const [inputPrice, setInputPrice] = React.useState<number>(0);
  const [openDetails, setOpenDetails] = React.useState<boolean>(false);

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
      value="candles"
      key="candles"
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

  if (apiStore.chart_data.length > 0) {
    before_previous_price =
      apiStore.chart_data[apiStore.chart_data.length - 3].price;
    previous_price = apiStore.chart_data[apiStore.chart_data.length - 2].price;
    current_price = apiStore.chart_data[apiStore.chart_data.length - 1].price;
  }

  if (apiStore.ohlc.length > 1) {
    previous_candles = {
      open: apiStore.candlesticks[apiStore.candlesticks.length - 1].open,
      high: apiStore.candlesticks[apiStore.candlesticks.length - 1].high,
      low: apiStore.candlesticks[apiStore.candlesticks.length - 1].low,
      close: apiStore.ohlc[apiStore.ohlc.length - 2].close,
    };
    current_candles = {
      open: apiStore.ohlc[apiStore.ohlc.length - 1].open,
      high: apiStore.ohlc[apiStore.ohlc.length - 1].high,
      low: apiStore.ohlc[apiStore.ohlc.length - 1].low,
      close: apiStore.ohlc[apiStore.ohlc.length - 1].close,
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

        {apiStore.chart_data.length > 0 && (
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

        {apiStore.interval !== "1t" && apiStore.ohlc.length > 1 && (
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
      <form action="">
        <div className="side-bar-input">
          <div className="amount">
            <IconButton
              aria-label="delete"
              onClick={() => {
                if (inputPrice <= 0) return;
                setInputPrice(inputPrice - 1);
              }}
            >
              <Remove />
            </IconButton>
            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">USD</InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
              type="number"
              variant="standard"
              value={inputPrice}
              onChange={(e) => setInputPrice(Number(e.target.value))}
              // error={}
              // helperText={}
            />
            <IconButton
              aria-label="delete"
              onClick={() => setInputPrice(inputPrice + 1)}
            >
              <Add />
            </IconButton>
          </div>
          <Button variant="contained" color="success">
            BUY
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75M5.75 13.5L12 22.25l6.25-8.75L12 17.25L5.75 13.5Z"
              />
            </svg>
          </Button>
          <Button variant="contained" color="error">
            SELL
            {inputPrice / current_candles.close}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75M5.75 13.5L12 22.25l6.25-8.75L12 17.25L5.75 13.5Z"
              />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default observer(Action);
