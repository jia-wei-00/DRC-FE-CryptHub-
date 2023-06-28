import * as React from "react";
import { authStore } from "../stores";
import { pages, settings } from "../constant";
import { Link } from "react-router-dom";
import "../styles/components/nav.scss";
import CustomizedSwitches from "./theme-toggle";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { AuthDialog, ProfileDialog, ForgotPasswordDialog } from "./dialog";

function Nav() {
  const [active, setActive] = React.useState<string>("login");
  const [openProfile, setOpenProfile] = React.useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

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
      setOpenProfile(true);
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

            <ProfileDialog
              openProfile={openProfile}
              setOpenProfile={setOpenProfile}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default observer(Nav);
