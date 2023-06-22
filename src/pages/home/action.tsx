import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { apiStore } from "../../stores";
import { observer } from "mobx-react-lite";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

interface ActionProps {
  currency: string;
  setcurrency: React.Dispatch<React.SetStateAction<string>>;
}

const Action: React.FC<ActionProps> = ({ currency, setcurrency }) => {
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
          <FormControl sx={{ m: 1, minWidth: 80, display: "flex" }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Currency
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={currency}
              onChange={(e) => {
                setcurrency(e.target.value);
                apiStore.unsubscribeTicks(currency);
                apiStore.resetData();
              }}
              autoWidth
              label="Currency"
            >
              <MenuItem value="cryBTCUSD">cryBTCUSD</MenuItem>
              <MenuItem value="cryETHUSD">cryETHUSD</MenuItem>
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
          </div>
        </>
      )}
    </>
  );
};

export default observer(Action);
