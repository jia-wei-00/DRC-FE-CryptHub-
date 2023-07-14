import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { authStore, modeStore, websocketStore } from "../../stores";
import { BuySellBoxT } from "../../types";
import tradeStore from "../../stores/trade-store";
import { Add, Remove } from "@mui/icons-material";
import { BTCIcon, ETHIcon, USDIcon } from "../../assets/icons";
import { NumericFormat } from "react-number-format";

const BuySellBox: React.FC<BuySellBoxT> = ({
  current_price,
  current_candles,
}) => {
  const [active, setActive] = React.useState<string>("buy");
  const [input, setInput] = React.useState<string>("");

  //onchange function for USD input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim(); // Remove leading/trailing whitespace
    let value = inputValue.replace(/[^0-9.]/g, ""); // Remove non-digit and non-decimal characters
    const decimalCount = value.split(".").length - 1;

    // Remove extra decimal points if present
    if (decimalCount > 1) {
      value = value.replace(/\./g, "");
    }

    setInput(value);
  };

  //get the price for every second (ETH / BTC)
  const price =
    websocketStore.interval === "1t" ? current_price : current_candles.close;
  //get the coin based on USD input
  const buy_coin = price === 0 ? 0 : Number(input) / price;
  const sell_coin = price === 0 ? 0 : Number(input) * price;

  //function for buy and sell token
  const buySellHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authStore.user) {
      return authStore.setAuthModal(true);
    }

    active === "buy"
      ? tradeStore.buyToken(Number(input), price, buy_coin)
      : tradeStore.sellToken(price, Number(input));

    setInput("");
  };

  return (
    <div className="card" id="buy-sell ">
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

      {/* Buy Form */}
      <motion.form onSubmit={buySellHandler}>
        <div className="side-bar-input">
          <div className="amount">
            <IconButton
              aria-label="subtract"
              onClick={() => setInput((Number(input) - 1).toString())}
              disabled={Number(input) <= 0}
            >
              <Remove />
            </IconButton>
            <NumericFormat
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {active === "buy"
                      ? "USD"
                      : websocketStore.subscribe_currency}
                  </InputAdornment>
                ),
              }}
              type="text"
              placeholder="0"
              variant="standard"
              onChange={handleInputChange}
              value={input}
              inputProps={{
                min: 1,
              }}
              decimalScale={2}
              customInput={TextField}
              allowNegative={false}
            />

            <IconButton
              aria-label="add"
              onClick={() => setInput((Number(input) + 1).toString())}
            >
              <Add />
            </IconButton>
          </div>
          <Button
            variant="contained"
            color={active === "buy" ? "success" : "error"}
            className="buy-sell-btn"
            disabled={buy_coin <= 0 || Number.isNaN(buy_coin)}
            type="submit"
          >
            <span>{active === "buy" ? "BUY" : "SELL"}</span>
            {active === "buy" ? buy_coin.toFixed(8) : sell_coin}
            {active === "buy"
              ? websocketStore.subscribe_currency === "ETH"
                ? ETHIcon
                : BTCIcon
              : USDIcon}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default BuySellBox;
