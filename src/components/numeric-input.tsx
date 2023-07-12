import React from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { Remove, Add } from "@mui/icons-material";

type AddP2PContractFormT = {
  coin_amount?: number;
  price?: number;
};

interface CoinInputProps {
  control: any;
  errors: FieldErrors<AddP2PContractFormT>;
  getValues: any;
  setValue: any;
  currency: string;
  name: keyof AddP2PContractFormT;
}

const CurrencyInput: React.FC<CoinInputProps> = ({
  control,
  errors,
  getValues,
  setValue,
  currency,
  name,
}) => {
  const handleAdd = () => {
    const price_value = getValues(name) as number;
    if (price_value >= 30000) return;
    setValue(name, Number.isNaN(price_value) ? 0 : price_value + 1);
  };

  const handleSubtract = () => {
    const price_value = getValues(name) as number;
    if (price_value <= 0) return;
    setValue(name, Number.isNaN(price_value) ? 0 : price_value - 1);
  };

  return (
    <Box className="deposit-input-box">
      <IconButton onClick={handleSubtract} aria-label="subtract">
        <Remove />
      </IconButton>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <NumericFormat
            onValueChange={(values) => onChange(values.floatValue)}
            value={value}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{currency}</InputAdornment>
              ),
            }}
            inputProps={{
              inputMode: "numeric",
            }}
            label="Coin to sell"
            variant="standard"
            error={!!errors.coin_amount}
            helperText={errors.coin_amount?.message}
            decimalScale={2}
            customInput={TextField}
            allowNegative={false}
          />
        )}
      />

      <IconButton onClick={handleAdd} aria-label="add">
        <Add />
      </IconButton>
    </Box>
  );
};

export default CurrencyInput;
