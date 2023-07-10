// import { HomePage, CoinPage, PortfolioPage } from "./pages";

import { Placement } from "react-joyride";
import { P2P } from "./pages";
import HomePage from "./pages/home";

export const pages = [
  { title: "Home", path: "/", element: <HomePage /> },
  { title: "P2P Trader", path: "/p2pTrader", element: <P2P /> },
];

export const settings = [{ title: "Profile" }, { title: "Logout" }];

export const headers = (token: string) => {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
};

export const domain = `http://${import.meta.env.VITE_API_DOMAIN}:5000`;

export const steps = [
  {
    title: "Theme toggle",
    content: "Click this to toggle dark and light theme",
    target: "#dark-light-toggle",
    placement: "bottom" as Placement,
  },
  {
    title: "Wallet",
    content: "Click this to see your wallet, deposit and withdraw USD",
    target: "#wallet",
    placement: "bottom" as Placement,
  },
  {
    title: "Profile",
    content: "Click this to see your profile or logout",
    target: "#profile",
    placement: "bottom" as Placement,
  },
  {
    title: "Chart Settings",
    content: "This is the settings you can change the chart details",
    target: "#chart-settings",
    placement: "left" as Placement,
  },
  {
    title: "Buy and Sell",
    content: "Click this the section to buy or sell token",
    target: "#buy-sell",
    placement: "top" as Placement,
  },
];

export const MODALACTIONS = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  FORGOTPASSWORD: "forgot_password",
  AUTHACTIVE: "auth_active",
};
