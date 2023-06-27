import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  AuthDialogT,
  ChartSettingsT,
  ForgotPasswordDialogT,
  ProfileT,
} from "../types";
import { motion } from "framer-motion";
import { apiStore, modeStore } from "../stores";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import { CandlestickChart, Timeline } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import React from "react";
import ForgotPasswordForm from "./forget-password";

export const ForgotPasswordDialog: React.FC<ForgotPasswordDialogT> = ({
  forgotPassword,
  setForgotPassword,
}) => {
  return (
    <Dialog
      open={forgotPassword}
      onClose={() => setForgotPassword(false)}
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
            <ForgotPasswordForm setForgotPassword={setForgotPassword} />
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
  setForgotPassword,
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
                setResetPassword={setForgotPassword}
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export const ProfileDialog: React.FC<ProfileT> = ({
  openProfile,
  setOpenProfile,
}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Dialog
      open={openProfile}
      onClose={() => setOpenProfile(false)}
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
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: "divider" }}
            >
              <Tab label="Item One" {...a11yProps(0)} />
              <Tab label="Item Two" {...a11yProps(1)} />
              <Tab label="Item Three" {...a11yProps(2)} />
              <Tab label="Item Four" {...a11yProps(3)} />
              <Tab label="Item Five" {...a11yProps(4)} />
              <Tab label="Item Six" {...a11yProps(5)} />
              <Tab label="Item Seven" {...a11yProps(6)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
              Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
              Item Three
            </TabPanel>
            <TabPanel value={value} index={3}>
              Item Four
            </TabPanel>
            <TabPanel value={value} index={4}>
              Item Five
            </TabPanel>
            <TabPanel value={value} index={5}>
              Item Six
            </TabPanel>
            <TabPanel value={value} index={6}>
              Item Seven
            </TabPanel>
          </CardContent>
        </Card>
      </div>
    </Dialog>
  );
};
