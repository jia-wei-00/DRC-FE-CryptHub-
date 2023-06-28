import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { authStore, modeStore, websocketStore } from "../../stores";
import { BuySellBoxT } from "../../types";
import tradeStore from "../../stores/trade-store";
import { Add, Remove } from "@mui/icons-material";

const BuySellBox: React.FC<BuySellBoxT> = ({
  current_price,
  current_candles,
}) => {
  const [active, setActive] = React.useState<string>("buy");
  const [input, setInput] = React.useState<number>(0);

  //onchange function for USD input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim(); // Remove leading/trailing whitespace
    const value =
      inputValue.startsWith("0") && inputValue.length > 1
        ? inputValue.slice(1)
        : inputValue;
    setInput(Number(value));
  };

  //get the price for every second (ETH / BTC)
  const price =
    websocketStore.interval === "1t" ? current_price : current_candles.close;
  //get the coin based on USD input
  const buy_coin = price === 0 ? 0 : input / price;

  //function for buy token
  const buySellHandler = () => {
    if (!authStore.user) {
      return authStore.setAuthModal(true);
    }

    active === "buy"
      ? tradeStore.buyToken(price, buy_coin)
      : tradeStore.sellToken();
  };

  //function for sell token
  const sellHandler = () => {
    // tradeStore.sellToken(price, buy_coin);
  };

  return (
    <div className="card">
      <motion.div className="buy-sell-toggle">
        <Button onClick={() => setActive("buy")}>Buy</Button>
        <Button onClick={() => setActive("sell")}>Sell</Button>

        {/* Buy */}
        <motion.div
          animate={active === "buy" ? { x: 0 } : { x: "100%" }}
          className="indicator"
          style={
            modeStore.mode === "dark"
              ? { backgroundColor: "rgba(255, 255, 255, 0.9)" }
              : { backgroundColor: "#f6e6cb" }
          }
        />
      </motion.div>

      {/* Buy*/}
      <motion.div
      // animate={
      //   active === "buy"
      //     ? { display: "block" }
      //     : { display: "none", opacity: 0 }
      // }
      >
        <div className="side-bar-input">
          <div className="amount">
            <IconButton
              aria-label="subtract"
              onClick={() => {
                if (input === 0) return;
                setInput(input - 1);
              }}
            >
              <Remove />
            </IconButton>

            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {active === "buy"
                      ? "USD"
                      : websocketStore.subscribe_currency}
                  </InputAdornment>
                ),
              }}
              type="number"
              variant="standard"
              onChange={handleInputChange}
              value={input}
            />

            <IconButton aria-label="add" onClick={() => setInput(input + 1)}>
              <Add />
            </IconButton>
          </div>
          <Button
            variant="contained"
            color={active === "buy" ? "success" : "error"}
            className="buy-sell-btn"
            disabled={price <= 0}
            onClick={buySellHandler}
          >
            <span>{active === "buy" ? "BUY" : "SELL"}</span>
            {buy_coin.toFixed(8)}
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
      </motion.div>
    </div>
  );
};

export default BuySellBox;
