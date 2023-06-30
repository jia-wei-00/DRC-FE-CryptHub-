import * as React from "react";
import { authStore } from "../stores";
import { pages, settings } from "../constant";
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
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { AuthDialog, ForgotPasswordDialog } from "./dialog";

const DepositOption = () => {
  const handleDepositClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    // event.stopPropagation();
    authStore.deposit();
  };

  return (
    <Button className="deposit" onClick={handleDepositClick}>
      Deposit
    </Button>
  );
};

function Nav() {
  const [active, setActive] = React.useState<string>("login");
  const [forgotPassword, setForgotPassword] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const navigate = useNavigate();

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

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
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
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            className="desktop-hide"
          >
            <MenuIcon />
          </IconButton>
          <Link to="/">
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
              }}
            >
              LOGO
            </Typography>
          </Link>

          <Box className="link-column mobile-hide">
            {pages.map((page, index) => (
              <Link key={index} className="link" to={page.path}>
                {page.title}
              </Link>
            ))}
          </Box>

          <button onClick={() => authStore.reset()}>RESET</button>

          <FormControl size="small">
            <InputLabel id="demo-simple-select-label">WALLET</InputLabel>
            <Select label="wallet" defaultValue={0}>
              <MenuItem value={0}>{authStore.user?.USD} USD</MenuItem>
              <MenuItem value={1}>{authStore.user?.ETH} ETH</MenuItem>
              <MenuItem value={2}>{authStore.user?.BTC} BTC</MenuItem>
              <Divider />

              <DepositOption />
            </Select>
          </FormControl>

          <Box>
            <div className="nav-end">
              <CustomizedSwitches />
              {authStore.user ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt="Remy Sharp"
                        // src="/static/images/avatar/2.jpg"
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
              {settings.map((setting) => (
                <MenuItem
                  key={setting.title}
                  onClick={() => handleCloseUserMenu(setting.title)}
                >
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>

            <AuthDialog
              active={active}
              setActive={setActive}
              setForgotPassword={setForgotPassword}
            />

            <ForgotPasswordDialog
              forgotPassword={forgotPassword}
              setForgotPassword={setForgotPassword}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default observer(Nav);
