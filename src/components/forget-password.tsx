import * as React from "react";
import { authStore } from "../stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/login-page-schemas";
import { InputData } from "../types";
import { SubmitHandler, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from "@mui/material";
import { EmailRounded } from "@mui/icons-material";
import "../styles/components/login-form.scss";

interface ResetFormProps {
  setResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResetPasswordForm: React.FC<ResetFormProps> = (props) => {
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
  } = useForm<InputData>({
    resolver: zodResolver(loginSchema),
  });

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<InputData> = (values) => {
    authStore.resetPassword(values, props.setResetPassword);
  };

  return (
    <motion.form
      className="mt-10 form"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      {/* Email Input */}
      Fill in your email to reset
      <Box className={`${!!errors["email"] ? "flex-center" : "flex-end"} box`}>
        <EmailRounded className="icon" />
        <FormControl variant="standard" className="form-control">
          <InputLabel error={!!errors["email"]} htmlFor="standard-email">
            Email
          </InputLabel>
          <Input
            error={!!errors["email"]}
            type="email"
            {...register("email")}
          />
          <FormHelperText error={!!errors["email"]}>
            {errors["email"] ? errors["email"].message : ""}
          </FormHelperText>
        </FormControl>
      </Box>
      <Button type="submit" variant="contained" className="mt-10">
        RESET PASSWORD
      </Button>
    </motion.form>
  );
};

export default ResetPasswordForm;
