import React from "react";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { Remove, Add } from "@mui/icons-material";
import { CurrencyFormatterT } from "../types";

const CurrencyInput: React.FC<CurrencyFormatterT> = ({
  control,
  errors,
  getValues,
  setValue,
  currency,
  name,
  label,
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
            label={label}
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
