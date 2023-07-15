import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { HandleModalReducerT, PriceT } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { walletStore } from "../stores";
import { Button } from "@mui/material";
import { depositSchema } from "../schemas";
import { MODALACTIONS } from "../constant";
import CurrencyInput from "./numeric-input";

const WithdrawForm: React.FC<HandleModalReducerT> = ({ dispatch }) => {
  const {
    control,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
    setValue,
    getValues,
  } = useForm<PriceT>({
    defaultValues: {
      price: 0,
    },
    resolver: zodResolver(depositSchema),
  });

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      dispatch({ type: MODALACTIONS.WITHDRAW, payload: false });
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<PriceT> = (values) => {
    walletStore.withdraw(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="deposit-form">
      Put your withdraw amount
      <CurrencyInput
        control={control}
        errors={errors}
        getValues={getValues}
        setValue={setValue}
        currency="USD"
        name="price"
      />
      <Button type="submit" variant="contained">
        Withdraw
      </Button>
    </form>
  );
};

export default WithdrawForm;
