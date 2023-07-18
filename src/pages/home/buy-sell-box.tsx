import { Button } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import {
  authStore,
  modeStore,
  websocketStore,
  tradeStore,
  walletStore,
  modalStore,
} from "../../stores";
import { AddP2PContractFormT, BuySellBoxT } from "../../types";
import { BTCIcon, ETHIcon, USDIcon } from "../../assets/icons";
import { ConfirmationPopUp, CurrencyInput } from "../../components";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { priceSchema } from "../../schemas";

const BuySellBox: React.FC<BuySellBoxT> = ({
  current_price,
  current_candles,
}) => {
  const [active, setActive] = React.useState<string>("buy");

  const {
    formState: { errors, isSubmitSuccessful },
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
  } = useForm<AddP2PContractFormT>({
    defaultValues: {
      price: 0,
    },
    resolver: zodResolver(
      priceSchema(
        active === "buy"
          ? walletStore.wallet.USD
          : walletStore.wallet[
              websocketStore.subscribe_currency as keyof typeof walletStore.wallet
            ]
      )
    ),
  });

  //get the price for every second (ETH / BTC)
  const price =
    websocketStore.interval === "1t" ? current_price : current_candles.close;
  //get the coin based on USD input
  const buy_coin = price === 0 ? 0 : watch("price") / price;
  const sell_coin = price === 0 ? 0 : watch("price") * price;

  const buySellHandler: SubmitHandler<AddP2PContractFormT> = (values) => {
    if (!authStore.user) {
      return authStore.setAuthModal(true);
    }

    active === "buy"
      ? modalStore.setConfirmationModal(
          () => tradeStore.buyToken(values.price, price, buy_coin),
          "buy",
          null,
          "USD",
          websocketStore.subscribe_currency,
          buy_coin,
          values.price
        )
      : modalStore.setConfirmationModal(
          () => tradeStore.sellToken(price, values.price),
          "sell",
          null,
          websocketStore.subscribe_currency,
          "USD",
          sell_coin,
          values.price
        );
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <div className="card" id="buy-sell">
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
      <motion.form onSubmit={handleSubmit(buySellHandler)}>
        <div className="side-bar-input">
          <CurrencyInput
            control={control}
            errors={errors}
            getValues={getValues}
            setValue={setValue}
            currency={
              active === "buy" ? "USD" : websocketStore.subscribe_currency
            }
            name="price"
            label=""
          />
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

      {modalStore.confirmation_modal.open && <ConfirmationPopUp />}
    </div>
  );
};

export default BuySellBox;
