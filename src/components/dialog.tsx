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
  Divider,
  useMediaQuery,
} from "@mui/material";
import { BooleanState, HandleModalReducerT, SellOnMarketT } from "../types";
import { motion } from "framer-motion";
import {
  websocketStore,
  modeStore,
  authStore,
  modalStore,
  tourStore,
  walletStore,
} from "../stores";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import { ArrowRightAlt, CandlestickChart, Timeline } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import React from "react";
import ForgotPasswordForm from "./forget-password";
import DepositForm from "./deposit-form";
import WithdrawForm from "./withdraw-form";
import SellOnMarketForm from "./sell-on-market-form";
import { MODALACTIONS } from "../constant";
import { useNavigate } from "react-router-dom";
import "../styles/components/dialog.scss";

export const ForgotPasswordDialog: React.FC<HandleModalReducerT> = ({
  modal,
  dispatch,
}) => {
  return (
    <Dialog
      open={modal!.forgot_password_modal}
      onClose={() =>
        dispatch({
          type: MODALACTIONS.FORGOTPASSWORD,
          payload: !modal!.forgot_password_modal,
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
                    modal!.auth_modal_active === "register"
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
                  modal!.auth_modal_active === "login"
                    ? { height: "auto" }
                    : { height: 0, opacity: 0 }
                }
              >
                <LoginForm dispatch={dispatch} />
              </motion.div>
              <motion.div
                animate={
                  modal!.auth_modal_active === "register"
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

export const ChartSettingsDialog: React.FC<BooleanState> = observer(
  ({ state, setState }) => {
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
        open={state}
        onClose={() => setState(false)}
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
      open={modal!.deposit_modal}
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
      open={modal!.withdraw_modal!}
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
  const [wallet, setWallet] = React.useState<{
    USD: number;
    BTC: number;
    ETH: number;
  }>({
    USD: walletStore.wallet.USD,
    BTC: walletStore.wallet.BTC,
    ETH: walletStore.wallet.ETH,
  });

  const handleConfirmation = async () => {
    if (modalStore.confirmation_modal.modal_function) {
      await modalStore.confirmation_modal.modal_function();
    }
    modalStore.setConfirmationModal(null, null, null, null, null, null, null);
  };

  const matches = useMediaQuery("(max-width:450px)");

  const modal_props = modalStore.confirmation_modal;
  const type = modal_props.type;
  const pay_currency = modal_props.pay_currency;
  const get_currency = modal_props.get_currency;

  React.useEffect(() => {
    if (type === "delete") {
      setWallet({
        ...wallet,
        [get_currency as keyof typeof wallet]:
          wallet[get_currency as keyof typeof wallet] + modal_props.receive!,
      });
    } else if (type === "sell_p2p") {
      setWallet({
        ...wallet,
        [pay_currency as keyof typeof wallet]:
          wallet[pay_currency as keyof typeof wallet] - modal_props.pay!,
      });
    } else if (type === "buy_p2p" || type === "buy" || type === "sell") {
      setWallet({
        ...wallet,
        [pay_currency as keyof typeof wallet]:
          wallet[pay_currency as keyof typeof wallet] - modal_props.pay!,
        [get_currency as keyof typeof wallet]:
          wallet[get_currency as keyof typeof wallet] + modal_props.receive!,
      });
    }
  }, []);

  return (
    <Dialog
      open={modalStore.confirmation_modal.open}
      onClose={() =>
        modalStore.setConfirmationModal(
          null,
          null,
          null,
          null,
          null,
          null,
          null
        )
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
            <DialogTitle>PRESS YES TO PROCEED</DialogTitle>
            <DialogContent>
              {/* Press yes to {modalStore.confirmation_modal.text}! */}
              <div className="pay-get">
                <div>
                  {modal_props.pay && (
                    <>
                      Payout: <br />
                    </>
                  )}
                  {modal_props.receive && <>Receive:</>}
                </div>
                <div>
                  {modal_props.pay && (
                    <>
                      {modal_props.pay + " " + modal_props.pay_currency!}
                      <br />
                    </>
                  )}
                  {modal_props.receive &&
                    "~" +
                      modal_props.receive.toFixed(4) +
                      " " +
                      modal_props.get_currency!}
                </div>
              </div>
              <div
                className={`before-after ${
                  modeStore.mode === "light" && "before-after-box"
                }`}
              >
                <div>
                  <div>Before:</div>
                  <div>
                    <span>USD</span>
                    {walletStore.wallet.USD.toFixed(2)}
                  </div>
                  <div>
                    <span>ETH</span>
                    {walletStore.wallet.ETH.toFixed(4)}
                  </div>
                  <div>
                    <span>BTC</span>
                    {walletStore.wallet.BTC.toFixed(4)}
                  </div>
                </div>
                <ArrowRightAlt
                  className={`arrow-icon ${matches && "rotate-arrow"}`}
                />
                <div>
                  <div>After:</div>
                  <div>
                    <span>USD</span>
                    {wallet.USD.toFixed(2)}
                  </div>
                  <div>
                    <span>ETH</span>
                    {"~" + wallet.ETH.toFixed(4)}
                  </div>
                  <div>
                    <span>BTC</span>
                    {"~" + wallet.BTC.toFixed(4)}
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() =>
                  modalStore.setConfirmationModal(
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                  )
                }
                color="error"
                variant="contained"
              >
                No
              </Button>
              <Button
                onClick={handleConfirmation}
                color="success"
                variant="contained"
              >
                Yes
              </Button>
            </DialogActions>
          </CardContent>
        </Card>
      </div>
    </Dialog>
  );
});

export const TourDialog: React.FC = observer(() => {
  const navigate = useNavigate();

  const handleOpenTour = () => {
    tourStore.setTourModal(false);
    navigate("/");
    tourStore.setTour({ home: true });
  };

  return (
    <Dialog
      open={tourStore.tour_modal}
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
            <DialogTitle>Welcome {authStore.user?.name}</DialogTitle>
            <Divider />
            <DialogContent>Do you want a tour guide?</DialogContent>
            <DialogActions>
              <Button
                onClick={() => tourStore.setTourModal(false)}
                color="error"
                variant="contained"
              >
                Skip
              </Button>
              <Button
                onClick={handleOpenTour}
                color="success"
                variant="contained"
              >
                Yes
              </Button>
            </DialogActions>
          </CardContent>
        </Card>
      </div>
    </Dialog>
  );
});
