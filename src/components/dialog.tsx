import {
  Button,
  Card,
  CardContent,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { ChartSettingsT, HandleModalReducerT, SellOnMarketT } from "../types";
import { motion } from "framer-motion";
import { websocketStore, modeStore, authStore, modalStore } from "../stores";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import { CandlestickChart, Timeline } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import React from "react";
import ForgotPasswordForm from "./forget-password";
import DepositForm from "./deposit-form";
import WithdrawForm from "./withdraw-form";
import SellOnMarketForm from "./sell-on-market-form";
import { MODALACTIONS } from "../constant";

export const ForgotPasswordDialog: React.FC<HandleModalReducerT> = ({
  modal,
  dispatch,
}) => {
  return (
    <Dialog
      open={modal.forgot_password_modal}
      onClose={() =>
        dispatch({
          type: MODALACTIONS.FORGOTPASSWORD,
          payload: !modal.forgot_password_modal,
        })
      }
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <div className="wrapper">
        <Card className="card">
          <CardContent>
            <ForgotPasswordForm modal={modal} dispatch={dispatch} />
          </CardContent>
        </Card>
      </div>
    </Dialog>
  );
};

export const AuthDialog: React.FC<HandleModalReducerT> = observer(
  ({ modal, dispatch }) => {
    return (
      <Dialog
        open={authStore.auth_modal}
        onClose={() => authStore.setAuthModal(false)}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <div className="wrapper">
          <Card className="card">
            <CardContent>
              <motion.div className="btn-group">
                <Button
                  onClick={() =>
                    dispatch({
                      type: MODALACTIONS.AUTHACTIVE,
                      payload: "login",
                    })
                  }
                >
                  Login
                </Button>
                <Button
                  onClick={() =>
                    dispatch({
                      type: MODALACTIONS.AUTHACTIVE,
                      payload: "register",
                    })
                  }
                >
                  Register
                </Button>
                <motion.div
                  animate={
                    modal.auth_modal_active === "register"
                      ? { x: "100%" }
                      : { x: 0 }
                  }
                  className="indicator"
                  style={
                    modeStore.mode === "dark"
                      ? { backgroundColor: "rgba(255, 255, 255, 0.9)" }
                      : { backgroundColor: "#f6e6cb" }
                  }
                />
              </motion.div>
              <motion.div
                animate={
                  modal.auth_modal_active === "login"
                    ? { height: "auto" }
                    : { height: 0, opacity: 0 }
                }
              >
                <LoginForm dispatch={dispatch} />
              </motion.div>
              <motion.div
                animate={
                  modal.auth_modal_active === "register"
                    ? { height: "auto", marginTop: "-15px" }
                    : { height: 0, opacity: 0 }
                }
              >
                <RegisterForm />
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </Dialog>
    );
  }
);

export const ChartSettingsDialog: React.FC<ChartSettingsT> = observer(
  ({ openSettings, setOpenSettings }) => {
    const handleChangeChart = (
      _: React.MouseEvent<HTMLElement>,
      type: string
    ) => {
      if (type === null) return;
      websocketStore.setChartType(type);
    };

    const handleChangeInterval = (
      _: React.MouseEvent<HTMLElement>,
      interval: string
    ) => {
      if (interval === null) return;
      websocketStore.changeSubscribedInterval(interval);
    };

    const chart = [
      <ToggleButton value="line" key="line">
        <Timeline />
        Line
      </ToggleButton>,
      <ToggleButton
        value="candles"
        key="candles"
        disabled={websocketStore.interval === "1t"}
      >
        <CandlestickChart />
        Candle
      </ToggleButton>,
    ];

    const interval = [
      <ToggleButton
        value="1t"
        key="1t"
        disabled={websocketStore.chart_type !== "line"}
      >
        1 tick
      </ToggleButton>,
      <ToggleButton value="60" key="1m">
        1 minute
      </ToggleButton>,
      <ToggleButton value="1800" key="30m">
        30 minute
      </ToggleButton>,
      <ToggleButton value="3600" key="1h">
        1 hour
      </ToggleButton>,
      <ToggleButton value="86400" key="1d">
        1 day
      </ToggleButton>,
    ];

    const controlChart = {
      value: websocketStore.chart_type,
      onChange: handleChangeChart,
      exclusive: true,
    };

    const controlInterval = {
      value: websocketStore.interval,
      onChange: handleChangeInterval,
      exclusive: true,
    };

    return (
      <Dialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <div className="wrapper">
          <Card className="card">
            <CardContent sx={{ display: "grid", rowGap: "15px" }}>
              <FormControl sx={{ display: "flex" }}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Currency
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={websocketStore.subscribe_currency}
                  onChange={(e) => {
                    websocketStore.changeSubscribedCurrency(e.target.value);
                  }}
                  label="Currency"
                >
                  <MenuItem value="BTC">BTC</MenuItem>
                  <MenuItem value="ETH">ETH</MenuItem>
                </Select>
              </FormControl>

              <div className="chart">
                Chart Types
                <ToggleButtonGroup
                  {...controlChart}
                  aria-label="Medium sizes"
                  className="button-group"
                >
                  {chart}
                </ToggleButtonGroup>
              </div>

              <div className="chart">
                Time Interval
                <ToggleButtonGroup
                  {...controlInterval}
                  aria-label="Medium sizes"
                  className="button-group"
                  sx={{ flexWrap: "wrap" }}
                >
                  {interval}
                </ToggleButtonGroup>
              </div>
            </CardContent>
          </Card>
        </div>
      </Dialog>
    );
  }
);

export const DepositDialog: React.FC<HandleModalReducerT> = ({
  modal,
  dispatch,
}) => {
  return (
    <Dialog
      open={modal.deposit_modal}
      onClose={() => dispatch({ type: MODALACTIONS.DEPOSIT, payload: false })}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <div className="wrapper">
        <Card className="card">
          <CardContent>
            <DepositForm dispatch={dispatch} />
          </CardContent>
        </Card>
      </div>
    </Dialog>
  );
};

export const WithdrawDialog: React.FC<HandleModalReducerT> = ({
  modal,
  dispatch,
}) => {
  return (
    <Dialog
      open={modal.withdraw_modal!}
      onClose={() => dispatch({ type: MODALACTIONS.WITHDRAW, payload: false })}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <div className="wrapper">
        <Card className="card">
          <CardContent>
            <WithdrawForm dispatch={dispatch} />
          </CardContent>
        </Card>
      </div>
    </Dialog>
  );
};

export const SellOnMarkerPlace: React.FC<SellOnMarketT> = ({
  sellModal,
  setSellModal,
  active,
}) => {
  return (
    <Dialog
      open={sellModal!}
      onClose={() => setSellModal(false)}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <div className="wrapper">
        <Card className="card">
          <CardContent>
            <SellOnMarketForm setSellModal={setSellModal} active={active} />
          </CardContent>
        </Card>
      </div>
    </Dialog>
  );
};

export const ConfirmationPopUp: React.FC = observer(() => {
  const handleConfirmation = async () => {
    if (modalStore.confirmation_modal.modal_function) {
      await modalStore.confirmation_modal.modal_function();
    }
    modalStore.setConfirmationModal(null, "");
  };

  return (
    <Dialog
      open={modalStore.confirmation_modal.open}
      onClose={() => modalStore.setConfirmationModal(null, "")}
    >
      <DialogTitle>Alert</DialogTitle>
      <DialogContent>
        Press yes to {modalStore.confirmation_modal.text}!
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleConfirmation}
          color="success"
          variant="contained"
        >
          Yes
        </Button>
        <Button
          onClick={() => modalStore.setConfirmationModal(null, "")}
          color="error"
          variant="contained"
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
});
