import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { apiStore } from "../../stores";
import { observer } from "mobx-react-lite";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const Action: React.FC = () => {
  let beforePreviousPrice = 0;
  let previousPrice = 0;
  let currentPrice = 0;

  if (apiStore.chart_data.length > 10) {
    beforePreviousPrice =
      apiStore.chart_data[apiStore.chart_data.length - 3].price;
    previousPrice = apiStore.chart_data[apiStore.chart_data.length - 2].price;
    currentPrice = apiStore.chart_data[apiStore.chart_data.length - 1].price;
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
              value={apiStore.subscribeCurrency}
              onChange={(e) => {
                apiStore.changeSubscribedCurrency(e.target.value);
              }}
              label="Currency"
            >
              <MenuItem value="BTC">BTC</MenuItem>
              <MenuItem value="ETH">ETH</MenuItem>
            </Select>
          </FormControl>
          <div className="d-flex">
            <div className="price-items">
              <span>Previous Price: </span>
              <span
                className={`d-flex align-center mr-5 ${
                  currentPrice > previousPrice ? "green" : "red"
                }`}
              >
                ${previousPrice}
                {currentPrice > previousPrice ? (
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
                  currentPrice > previousPrice ? "green" : "red"
                }`}
              >
                ${currentPrice}{" "}
                {currentPrice > previousPrice ? (
                  <TrendingUpIcon />
                ) : (
                  <TrendingDownIcon />
                )}
              </span>
            </div>
            <button onClick={() => apiStore.changeSubscribedCurrency("ETH")}>
              Unsubscribe
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default observer(Action);
