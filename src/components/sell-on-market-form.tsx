import React from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { AddP2PContractFormT, SellOnMarketT } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Typography,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { addP2PSchema } from "../schemas";
import p2pStore from "../stores/p2p-store";
import { websocketStoreP2P } from "../stores";
import { observer } from "mobx-react-lite";
import ReactLoading from "react-loading";
import { NumericFormat } from "react-number-format";

const SellOnMarketForm: React.FC<SellOnMarketT> = ({ setSellModal }) => {
  const [coinAmount, setCoinAmount] = React.useState<number>(0);

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    control,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
  } = useForm<AddP2PContractFormT>({
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

  const handleAdd = () => {
    const price_value = getValues("price");
    if (price_value >= 30000) return;
    setValue("price", Number.isNaN(price_value) ? 0 : price_value + 1);
  };

  const handleSubtract = () => {
    const price_value = getValues("price");
    if (price_value <= 0) return;
    setValue("price", Number.isNaN(price_value) ? 0 : price_value - 1);
  };

  const handleAddCoin = () => {
    const price_value = getValues("coin_amount");
    if (price_value >= 30000) return;
    setValue("coin_amount", Number.isNaN(price_value) ? 0 : price_value + 1);
  };

  const handleSubtractCoin = () => {
    const price_value = getValues("coin_amount");
    if (price_value <= 0) return;
    setValue("coin_amount", Number.isNaN(price_value) ? 0 : price_value - 1);
  };

  console.log("rerender");

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="deposit-form">
      Insert the details
      <span className="add-contract-current-price">
        <Typography sx={{ margin: "0 10px" }}>Current Price:</Typography>
        {websocketStoreP2P.ticks === 0 ? (
          <ReactLoading type="bars" height={"20px"} width={"20px"} />
        ) : (
          websocketStoreP2P.ticks
        )}
      </span>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Currency</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
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
      <Box className="deposit-input-box">
        <IconButton onClick={handleSubtractCoin} aria-label="subtract">
          <Remove />
        </IconButton>

        {/* <NumericFormat
          {...register("coin_amount", { valueAsNumber: true })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {websocketStoreP2P.currency}
              </InputAdornment>
            ),
          }}
          label="Coin to sell"
          variant="standard"
          error={!!errors["coin_amount"]}
          defaultValue={0}
          helperText={!!errors.coin_amount && errors.coin_amount.message}
          decimalScale={2}
          customInput={TextField}
        /> */}

        <Controller
          control={control}
          {...register("coin_amount")}
          render={({ field }) => (
            <NumericFormat
              {...field}
              onChange={(event) => field.onChange(+event.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {websocketStoreP2P.currency}
                  </InputAdornment>
                ),
              }}
              inputProps={{
                inputMode: "numeric",
              }}
              label="Coin to sell"
              variant="standard"
              error={!!errors["coin_amount"]}
              defaultValue={0}
              helperText={!!errors.coin_amount && errors.coin_amount.message}
              decimalScale={2}
              customInput={TextField}
              allowNegative={false}
              // isAllowed={(field) => field.value <= 100}
            />
          )}
        />

        <IconButton onClick={handleAddCoin} aria-label="add">
          <Add />
        </IconButton>
      </Box>
      <Box className="deposit-input-box">
        <IconButton onClick={handleSubtract} aria-label="subtract">
          <Remove />
        </IconButton>
        <TextField
          InputProps={{
            endAdornment: <InputAdornment position="end">USD</InputAdornment>,
          }}
          type="number"
          label="Price"
          variant="standard"
          error={!!errors["price"]}
          defaultValue={0}
          helperText={!!errors.price && errors.price.message}
          {...register("price", { valueAsNumber: true })}
        />
        <IconButton onClick={handleAdd} aria-label="add">
          <Add />
        </IconButton>
      </Box>
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
