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
} from "@mui/material";
import ResetPasswordForm from "./forget-password";
import { AuthDialogT, ChartSettingsT, ResetPasswordDialogT } from "../types";
import { motion } from "framer-motion";
import { apiStore, modeStore } from "../stores";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import { CandlestickChart, Timeline } from "@mui/icons-material";
import { observer } from "mobx-react-lite";

export const ResetPasswordDialog: React.FC<ResetPasswordDialogT> = ({
  resetPassword,
  setResetPassword,
}) => {
  return (
    <Dialog
      open={resetPassword}
      onClose={() => setResetPassword(false)}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <div className="wrapper">
        {/* <motion.div
                  initial={{ y: 400 }}
                  animate={{ y: 0 }}
                  className="form-body"
                > */}
        <Card className="card">
          <CardContent>
            <ResetPasswordForm setResetPassword={setResetPassword} />
          </CardContent>
        </Card>
      </div>
    </Dialog>
  );
};

export const AuthDialog: React.FC<AuthDialogT> = ({
  open,
  setOpen,
  active,
  setActive,
  setResetPassword,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <div className="wrapper">
        {/* <motion.div
        initial={{ y: 400 }}
        animate={{ y: 0 }}
        className="form-body"
      > */}
        <Card className="card">
          <CardContent>
            <motion.div className="btn-group">
              <Button onClick={() => setActive("login")}>Login</Button>
              <Button onClick={() => setActive("register")}>Register</Button>
              <motion.div
                animate={active === "register" ? { x: "100%" } : { x: 0 }}
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
                active === "login"
                  ? { height: "auto" }
                  : { height: 0, opacity: 0 }
              }
            >
              <LoginForm
                setOpen={setOpen}
                setResetPassword={setResetPassword}
              />
            </motion.div>
            <motion.div
              animate={
                active === "register"
                  ? { height: "auto", marginTop: "-15px" }
                  : { height: 0, opacity: 0 }
              }
            >
              <RegisterForm setOpen={setOpen} />
            </motion.div>
          </CardContent>
        </Card>
        {/* </motion.div> */}
        {/* <HomeParticle />
      <ResetPassword
        openResetModal={openResetModal}
        setOpenResetModal={setOpenResetModal}
      /> */}
      </div>
    </Dialog>
  );
};

export const ChartSettingsDialog: React.FC<ChartSettingsT> = observer(
  ({ openSettings, setOpenSettings }) => {
    const handleChangeChart = (
      event: React.MouseEvent<HTMLElement>,
      type: string
    ) => {
      if (type === null) return;
      apiStore.setChartType(type);
    };

    const handleChangeInterval = (
      event: React.MouseEvent<HTMLElement>,
      interval: string
    ) => {
      if (interval === null) return;
      apiStore.changeSubscribedInterval(interval);
    };

    const chart = [
      <ToggleButton value="line" key="line">
        <Timeline />
        Line
      </ToggleButton>,
      <ToggleButton
        value="candles"
        key="candles"
        disabled={apiStore.interval === "1t"}
      >
        <CandlestickChart />
        Candle
      </ToggleButton>,
    ];

    const interval = [
      <ToggleButton
        value="1t"
        key="1t"
        disabled={apiStore.chart_type !== "line"}
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
      value: apiStore.chart_type,
      onChange: handleChangeChart,
      exclusive: true,
    };

    const controlInterval = {
      value: apiStore.interval,
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
                  value={apiStore.subscribe_currency}
                  onChange={(e) => {
                    apiStore.changeSubscribedCurrency(e.target.value);
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
