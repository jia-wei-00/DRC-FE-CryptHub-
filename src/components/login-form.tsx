import * as React from "react";
import { authStore } from "../stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/login-page-schemas";
import { InputData, LoginFormProps } from "../types";
import { SubmitHandler, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import {
  EmailRounded,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import "../styles/components/login-form.scss";

const LoginForm: React.FC<LoginFormProps> = (props) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

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
    authStore.signIn(values);
  };

  return (
    <motion.form
      className="mt-10 form"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      {/* Email Input */}
      <Box
        className={`${
          !!errors["email"] ? "flex-center" : "flex-end"
        } box mt-10`}
      >
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
      {/* Password Input */}
      <Box
        className={`${!!errors["password"] ? "flex-center" : "flex-end"} box`}
      >
        <Lock className="icon" />
        <FormControl variant="standard">
          <InputLabel
            error={!!errors["password"]}
            htmlFor="standard-adornment-password"
          >
            Password
          </InputLabel>
          <Input
            type={showPassword ? "text" : "password"}
            error={!!errors["password"]}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((show) => !show)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            {...register("password")}
          />
          <FormHelperText error={!!errors["password"]}>
            {errors["password"] ? errors["password"].message : ""}
          </FormHelperText>
          <div className="forget-password">
            <span>
              <span onClick={() => props.setResetPassword(true)}>
                Forget Password
              </span>
            </span>
          </div>
        </FormControl>
      </Box>
      <Button type="submit" variant="contained" className="mt-10">
        LOGIN
      </Button>
    </motion.form>
  );
};

export default LoginForm;
