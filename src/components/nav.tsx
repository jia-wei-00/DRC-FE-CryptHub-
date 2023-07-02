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
  useMediaQuery,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { AuthDialog, ForgotPasswordDialog } from "./dialog";
import { Image } from "@mui/icons-material";
import logo from "../assets/logo.svg";

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

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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
              <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">{page.title}</Typography>
              </MenuItem>
            ))}
          </Menu>

          <Link to="/">
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
                  <FormControl size="small">
                    <InputLabel id="demo-simple-select-label">
                      WALLET
                    </InputLabel>
                    <Select label="wallet" defaultValue={0}>
                      <MenuItem value={0}>{authStore.user?.USD} USD</MenuItem>
                      <MenuItem value={1}>{authStore.user?.ETH} ETH</MenuItem>
                      <MenuItem value={2}>{authStore.user?.BTC} BTC</MenuItem>
                      <Divider />

                      <DepositOption />
                    </Select>
                  </FormControl>
                </>
              )}
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
              {!matches && (
                <MenuItem>
                  <FormControl size="small">
                    <InputLabel id="demo-simple-select-label">
                      WALLET
                    </InputLabel>
                    <Select label="wallet" defaultValue={0}>
                      <MenuItem value={0}>{authStore.user?.USD} USD</MenuItem>
                      <MenuItem value={1}>
                        {authStore.user?.ETH.toFixed(4)} ETH
                      </MenuItem>
                      <MenuItem value={2}>
                        {authStore.user?.BTC.toFixed(4)} BTC
                      </MenuItem>
                      <Divider />

                      <DepositOption />
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
