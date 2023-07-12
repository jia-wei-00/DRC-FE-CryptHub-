import * as React from "react";
import { authStore } from "../stores";
import { MODALACTIONS, pages, settings } from "../constant";
import { Link, useNavigate } from "react-router-dom";
import "../styles/components/nav.scss";
import CustomizedSwitches from "./theme-toggle";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import {
  AuthDialog,
  DepositDialog,
  ForgotPasswordDialog,
  WithdrawDialog,
} from "./dialog";
import logo from "../assets/logo.svg";
import { Action, HandleModalReducerT, ModalState } from "../types";

const DepositOption: React.FC<HandleModalReducerT> = ({ modal, dispatch }) => {
  return (
    <>
      <Button
        className="deposit"
        onClick={() =>
          dispatch({
            type: MODALACTIONS.DEPOSIT,
            payload: !modal.deposit_modal,
          })
        }
      >
        Deposit
      </Button>
    </>
  );
};

const WithdrawOption: React.FC<HandleModalReducerT> = ({ modal, dispatch }) => {
  return (
    <>
      <Button
        className="deposit"
        onClick={() => {
          dispatch({
            type: MODALACTIONS.WITHDRAW,
            payload: !modal.withdraw_modal,
          });
        }}
      >
        Withdraw
      </Button>
    </>
  );
};

const initialModal: ModalState = {
  deposit_modal: false,
  withdraw_modal: false,
  forgot_password_modal: false,
  auth_modal_active: "login",
};

const reducer = (state: ModalState, action: Action): ModalState => {
  switch (action.type) {
    case MODALACTIONS.DEPOSIT:
      return { ...state, deposit_modal: action.payload as boolean };
    case MODALACTIONS.WITHDRAW:
      return { ...state, withdraw_modal: action.payload as boolean };
    case MODALACTIONS.FORGOTPASSWORD:
      return { ...state, forgot_password_modal: action.payload as boolean };
    case MODALACTIONS.AUTHACTIVE:
      return { ...state, auth_modal_active: action.payload as string };
    default:
      return state;
  }
};

function Nav() {
  const [modal, dispatch] = React.useReducer(reducer, initialModal);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const navigate = useNavigate();
  const matches = useMediaQuery("(min-width:1023px)");

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modalParam = urlParams.get("login");
    const isModalOpen = modalParam === "true";

    if (isModalOpen && authStore.user === null) {
      authStore.setAuthModal(true);

      //remove url to open login modal
      if (window.history && window.history.pushState) {
        const newURL = window.location.href.split("?")[0];
        window.history.pushState({}, document.title, newURL);
      }
    }
  }, []);

  React.useEffect(() => {
    if (authStore.user !== null) {
      authStore.fetchWallet();
    }
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (value: string) => {
    setAnchorElNav(null);

    if (value === "Crypthub Trader") {
      navigate("/");
    }

    if (value === "P2P Trader") {
      navigate("/p2pTrader");
    }
  };

  const handleCloseUserMenu = (value: string) => {
    setAnchorElUser(null);

    if (value === "Logout") {
      authStore.signOut();
    }

    if (value === "Profile") {
      navigate("/profile");
    }
  };

  return (
    <AppBar position="static" className="app-bar">
      <Container maxWidth="xl">
        <Toolbar disableGutters className="toolbar">
          {!matches && (
            <Box>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleOpenNavMenu}
                className="menu-icon"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
          >
            <MenuItem>
              <CustomizedSwitches />
            </MenuItem>

            {pages.map((page) => (
              <MenuItem
                key={page.title}
                onClick={() => handleCloseNavMenu(page.title)}
              >
                <Typography textAlign="center">{page.title}</Typography>
              </MenuItem>
            ))}
          </Menu>

          <Link to="https://crypthub.vercel.app/" target="_blank">
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
              }}
              className="logo"
            >
              <img src={logo} width={40} />
              CRYPTHUB
            </Typography>
          </Link>

          <Box className="link-column mobile-hide">
            {pages.map((page, index) => (
              <Link key={index} className="link" to={page.path}>
                {page.title}
              </Link>
            ))}
          </Box>

          <Box>
            <div className="nav-end">
              {matches && (
                <>
                  <CustomizedSwitches />
                  {authStore.user && (
                    <FormControl size="small" id="wallet">
                      <InputLabel id="demo-simple-select-label">
                        WALLET
                      </InputLabel>
                      <Select label="wallet" defaultValue={0}>
                        <MenuItem value={0}>
                          {authStore.wallet.USD && authStore.wallet.USD} USD
                        </MenuItem>
                        <MenuItem value={1}>
                          {authStore.wallet.ETH && authStore.wallet.USD} ETH
                        </MenuItem>
                        <MenuItem value={2}>
                          {authStore.wallet.BTC && authStore.wallet.USD} BTC
                        </MenuItem>
                        <Divider />

                        <DepositOption modal={modal} dispatch={dispatch} />
                        <WithdrawOption modal={modal} dispatch={dispatch} />
                      </Select>
                    </FormControl>
                  )}
                </>
              )}
              {authStore.user ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{ p: 0 }}
                      id="profile"
                    >
                      <Avatar
                        alt={authStore.user.name}
                        src="/static/images/avatar/2.jpg"
                      />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Button
                  onClick={() => authStore.setAuthModal(!authStore.auth_modal)}
                  variant="contained"
                >
                  Login
                </Button>
              )}
            </div>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {!matches && (
                <MenuItem>
                  <FormControl size="small">
                    <InputLabel id="demo-simple-select-label">
                      WALLET
                    </InputLabel>
                    <Select label="wallet" defaultValue={0}>
                      <MenuItem value={0}>{authStore.wallet.USD} USD</MenuItem>
                      <MenuItem value={1}>
                        {authStore.wallet.ETH.toFixed(4)} ETH
                      </MenuItem>
                      <MenuItem value={2}>
                        {authStore.wallet.BTC.toFixed(4)} BTC
                      </MenuItem>
                      <Divider />

                      <DepositOption modal={modal} dispatch={dispatch} />
                      <WithdrawOption modal={modal} dispatch={dispatch} />
                    </Select>
                  </FormControl>
                </MenuItem>
              )}
              {settings.map((setting) => (
                <MenuItem
                  key={setting.title}
                  onClick={() => handleCloseUserMenu(setting.title)}
                >
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>

            <AuthDialog modal={modal} dispatch={dispatch} />

            <ForgotPasswordDialog modal={modal} dispatch={dispatch} />

            <DepositDialog modal={modal} dispatch={dispatch} />

            <WithdrawDialog modal={modal} dispatch={dispatch} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default observer(Nav);
