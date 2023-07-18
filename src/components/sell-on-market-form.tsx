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
import { modalStore, p2pStore, tourStore, websocketStoreP2P } from "../stores";
import { observer } from "mobx-react-lite";
import CurrencyInput from "./numeric-input";
import { ConfirmationPopUp, Loading } from ".";
import { Steps } from "intro.js-react";
import { sellP2PModalTour } from "../constant";

const SellOnMarketForm: React.FC<SellOnMarketT> = ({ setSellModal }) => {
  const {
    formState: { errors, isSubmitSuccessful },
    control,
    reset,
    handleSubmit,
    setValue,
    watch,
    getValues,
  } = useForm<AddP2PContractFormT>({
    defaultValues: {
      coin_amount: 0,
      price: 0,
    },
    resolver: zodResolver(addP2PSchema(websocketStoreP2P.ticks)),
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
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<AddP2PContractFormT> = (values) => {
    modalStore.setConfirmationModal(
      () => p2pStore.addP2PContract(values, setSellModal),
      "sell_p2p",
      null,
      websocketStoreP2P.currency,
      null,
      null,
      values.coin_amount!
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)} className="deposit-form">
        Insert the details
        <span className="add-contract-current-price">
          <Typography sx={{ margin: "0 10px" }}>Current Price:</Typography>
          {websocketStoreP2P.ticks === 0 ? (
            <Loading height={"20px"} width={"20px"} />
          ) : (
            websocketStoreP2P.ticks *
            (watch("coin_amount")! === 0 ? 1 : watch("coin_amount")!)
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
        <div className="sell-p2p-input-field">
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
            label="price"
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          disabled={websocketStoreP2P.ticks === 0}
          id="sell-on-p2p"
        >
          SELL
        </Button>
      </form>
      <Steps
        enabled={tourStore.tour.sell_p2p}
        steps={sellP2PModalTour.steps}
        initialStep={0}
        onExit={() => tourStore.setTour({ sell_p2p: false })}
        options={sellP2PModalTour.options}
        onBeforeExit={(step) => {
          if (step === sellP2PModalTour.steps.length - 1) {
            setSellModal(false);
          }
        }}
      />
      {modalStore.confirmation_modal.open && <ConfirmationPopUp />}
    </>
  );
};

export default observer(SellOnMarketForm);
