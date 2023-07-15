import { P2P, Home } from "./pages";

export const pages = [
  { title: "Crypthub Trader", path: "/", element: <Home /> },
  { title: "P2P Trader", path: "/p2pTrader", element: <P2P /> },
];

export const settings = [{ title: "Profile" }, { title: "Logout" }];

export const headers = (token: string) => {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
};

export const domain = import.meta.env.VITE_API_DOMAIN;

export const MODALACTIONS = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  FORGOTPASSWORD: "forgot_password",
  AUTHACTIVE: "auth_active",
};

export const sellP2PModalTour = {
  options: {
    showProgress: true,
  },
  steps: [
    {
      element: ".add-contract-current-price",
      intro: "Current market price for ETH and BTC",
    },
    {
      element: "#wallet-currency-select",
      intro: "Choose crrency you want to sell",
    },
    {
      element: ".sell-p2p-input-field",
      intro: "Input coin amount to sell and selling price",
    },
    {
      element: "#sell-on-p2p",
      intro: "Create the contract",
    },
  ],
};

export const P2PTour = {
  options: {
    showProgress: true,
  },
  steps: [
    {
      element: ".filter",
      intro: "Filter market based on ETH or BTC",
    },
    {
      element: "#market-tour",
      intro: "To show all the contract on marketplace",
    },
    {
      element: "#ongoing-tour",
      intro: "Show all your contract on the marketplace",
    },
    {
      element: ".market-sell-box",
      intro: "Button to sell contract on the marketplace",
    },
  ],
};

export const homeTour = {
  options: {
    showProgress: true,
  },
  steps: [
    {
      element: "#profile-button",
      intro: "Profile with all transaction history and account settings",
    },
    {
      element: "#wallet",
      intro: "Wallet",
    },
    {
      element: "#dark-light-toggle",
      intro: "Toggle light and dark theme",
    },
    {
      element: "#chart-settings",
      intro: "Chart settings",
    },
    {
      element: "#buy-sell",
      intro: "Buy or sell token",
    },
  ],
};
