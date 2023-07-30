import {
  Button,
  CardContent,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { authStore } from "../../stores";

const ResetPasswordForm: React.FC = () => {
  return (
    <motion.form className="mt-10 reset-password-form">
      <CardContent>
        <DialogTitle>Reset Password</DialogTitle>
        <Divider />
        <DialogContent>Do you want to RESET PASSWORD?</DialogContent>
        <DialogActions>
          <Button
            onClick={() => authStore.resetPassword()}
            color="success"
            variant="contained"
          >
            Yes
          </Button>
        </DialogActions>
      </CardContent>
    </motion.form>
  );
};

export default ResetPasswordForm;
