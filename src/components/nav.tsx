import * as React from "react";
import { authStore, modeStore } from "../stores";
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
  Card,
  CardContent,
  Container,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import { observer } from "mobx-react-lite";

function Nav() {
  const [active, setActive] = React.useState<string>("login");
  const [open, setOpen] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (index: number) => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (value: string) => {
    setAnchorElUser(null);

    if (value === "Logout") {
      authStore.signOut();
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
                <Button onClick={() => setOpen(!open)} variant="contained">
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
                  key={setting}
                  onClick={() => handleCloseUserMenu(setting)}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>

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
                      <Button onClick={() => setActive("register")}>
                        Register
                      </Button>
                      <motion.div
                        animate={
                          active === "register" ? { x: "100%" } : { x: 0 }
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
                        active === "login"
                          ? { height: "auto" }
                          : { height: 0, opacity: 0 }
                      }
                    >
                      <LoginForm setOpen={setOpen} />
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default observer(Nav);
