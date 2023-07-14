import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
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
import { motion } from "framer-motion";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetSchema } from "../../schemas";
import { ResetPasswordFormT } from "../../types";
import { authStore } from "../../stores";

const ResetPasswordForm: React.FC = () => {
  const [showOldPassword, setShowOldPassword] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showRepeatPassword, setShowRepeatPassword] =
    React.useState<boolean>(false);

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
  } = useForm<ResetPasswordFormT>({
    resolver: zodResolver(resetSchema),
  });

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<ResetPasswordFormT> = (values) => {
    authStore.resetPassword(values);
  };

  return (
    <motion.form
      className="mt-10 reset-password-form"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      {/* Password Input */}
      <Box className={`${!!errors["old_password"] && "align-center "} box`}>
        <Lock className="icon" />
        <FormControl variant="standard">
          <InputLabel
            error={!!errors["old_password"]}
            htmlFor="standard-adornment-password"
          >
            Old Password
          </InputLabel>
          <Input
            type={showOldPassword ? "text" : "password"}
            error={!!errors["old_password"]}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowOldPassword((show) => !show)}
                  tabIndex={-1}
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            {...register("old_password")}
          />
          <FormHelperText error={!!errors["old_password"]}>
            {errors["old_password"] ? errors["old_password"].message : ""}
          </FormHelperText>
        </FormControl>
      </Box>

      {/* Password Input */}
      <Box className={`${!!errors["old_password"] && "align-center "} box`}>
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
                  tabIndex={-1}
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
        </FormControl>
      </Box>

      {/* Repeat Password Input */}
      <Box className={`${!!errors["new_password"] && "align-center "} box`}>
        <Lock className="icon" />
        <FormControl variant="standard" className="f-1">
          <InputLabel
            error={!!errors["new_password"]}
            htmlFor="standard-adornment-password"
          >
            Repeat Password
          </InputLabel>
          <Input
            type={showRepeatPassword ? "text" : "password"}
            error={!!errors["new_password"]}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowRepeatPassword((show) => !show)}
                  tabIndex={-1}
                >
                  {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            {...register("new_password")}
          />
          <FormHelperText error={!!errors["new_password"]}>
            {errors["new_password"] ? errors["new_password"].message : ""}
          </FormHelperText>
        </FormControl>
      </Box>

      <Button type="submit" variant="contained" className="mt-10">
        RESET
      </Button>
    </motion.form>
  );
};

export default ResetPasswordForm;
