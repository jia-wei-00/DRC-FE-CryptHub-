import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddP2PContractFormT, SellOnMarketT } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { addP2PSchema } from "../schemas";
import p2pStore from "../stores/p2p-store";
import { websocketStoreP2P } from "../stores";
import { observer } from "mobx-react-lite";
import CurrencyInput from "./numeric-input";
import { Loading } from ".";

const SellOnMarketForm: React.FC<SellOnMarketT> = ({ setSellModal }) => {
  const [coinAmount, setCoinAmount] = React.useState<number>(0);

  const {
    formState: { errors, isSubmitSuccessful },
    control,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
  } = useForm<AddP2PContractFormT>({
    defaultValues: {
      coin_amount: 0,
      price: 0,
    },
    resolver: zodResolver(addP2PSchema(websocketStoreP2P.ticks, coinAmount)),
  });

  React.useEffect(() => {
    if (websocketStoreP2P.ticks === 0) {
      websocketStoreP2P.subscribeTicks();
    }

    return () => {
      websocketStoreP2P.unsubscribeTicks();
    };
  }, []);

  React.useEffect(() => {
    setCoinAmount(Number(getValues("coin_amount")));
  }, [watch("coin_amount")]);

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      p2pStore.fetchP2PMarket();
      setSellModal(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<AddP2PContractFormT> = (values) => {
    p2pStore.addP2PContract(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="deposit-form">
      Insert the details
      <span className="add-contract-current-price">
        <Typography sx={{ margin: "0 10px" }}>Current Price:</Typography>
        {websocketStoreP2P.ticks === 0 ? (
          <Loading height={"20px"} width={"20px"} />
        ) : (
          websocketStoreP2P.ticks
        )}
      </span>
      <FormControl fullWidth>
        <InputLabel id="wallet-currency-select-label">Currency</InputLabel>
        <Select
          labelId="wallet-currency-select-label"
          id="wallet-currency-select"
          label="Currency"
          value={websocketStoreP2P.currency}
          onChange={(e) =>
            websocketStoreP2P.changeSubscribedCurrency(e.target.value)
          }
        >
          <MenuItem value="ETH">ETH</MenuItem>
          <MenuItem value="BTC">BTC</MenuItem>
        </Select>
      </FormControl>
      <CurrencyInput
        control={control}
        errors={errors}
        getValues={getValues}
        setValue={setValue}
        currency={websocketStoreP2P.currency}
        name="coin_amount"
        label="Coin to sell"
      />
      <CurrencyInput
        control={control}
        errors={errors}
        getValues={getValues}
        setValue={setValue}
        currency="USD"
        name="price"
        label="Price"
      />
      <Button
        type="submit"
        variant="contained"
        disabled={websocketStoreP2P.ticks === 0}
      >
        SELL
      </Button>
    </form>
  );
};

export default observer(SellOnMarketForm);
