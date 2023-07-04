// import { HomePage, CoinPage, PortfolioPage } from "./pages";

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

export const domain = "http://localhost:5000";
