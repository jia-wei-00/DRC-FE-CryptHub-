// import { HomePage, CoinPage, PortfolioPage } from "./pages";

import HomePage from "./pages/home";

export const pages = [{ title: "Home", path: "/", element: <HomePage /> }];

export const settings = [{ title: "Profile" }, { title: "Logout" }];

export const headers = (token: string) => {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
};

export const domain = "http://localhost:5000";
