import { P2P, Home } from "./pages";

export const pages = [
  {
    title: "Crypthub Trader",
    path: "/",
    element: <Home />,
    id: "home-page-tour",
  },
  {
    title: "P2P Trader",
    path: "/p2pTrader",
    element: <P2P />,
    id: "p2p-page-tour",
  },
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

const introjsOptions = {
  showProgress: true,
  tooltipClass: "custom-introjs-theme",
  highlightClass: "custom-introjs-highlight",
  showStepNumbers: false,
  exitOnOverlayClick: false,
};

export const sellP2PModalTour = {
  options: introjsOptions,
  steps: [
    {
      element: ".add-contract-current-price",
      intro: "Current market price for ETH and BTC.",
    },
    {
      element: "#wallet-currency-select",
      intro: "Choose the currency you want to sell.",
    },
    {
      element: ".sell-p2p-input-field",
      intro: "Input coin amount to sell and selling price.",
    },
    {
      element: "#sell-on-p2p",
      intro: "Create the contract and happy trading!",
    },
  ],
};

export const P2PTour = {
  options: introjsOptions,
  steps: [
    {
      element: ".filter",
      intro: "Filter market based on ETH or BTC.",
    },
    {
      element: "#market-tour",
      intro: "Display all available contracts on the marketplace.",
    },
    {
      element: "#ongoing-tour",
      intro: "Display all contracts created by you on the marketplace.",
    },
    {
      element: ".market-sell-box",
      intro: "Button to sell contract on the marketplace.",
    },
  ],
};

export const homeTour = {
  options: introjsOptions,
  steps: [
    {
      element: "#profile-button",
      intro:
        "Access comprehensive transaction history and efficiently manage your profile here.",
    },
    {
      element: "#wallet",
      intro:
        "Gain insights into your wallet balance, facilitate deposits, and execute withdrawals.",
    },
    {
      element: "#dark-light-toggle",
      intro: "Toggle between light and dark themes.",
    },
    {
      element: "#home-page-tour",
      intro: "Crypthub trader page.",
    },
    {
      element: "#chart-settings",
      intro:
        "Chart settings enable customization of currency, chart type, and interval for optimal visualization and analysis.",
    },
    {
      element: "#buy-sell",
      intro: "Initiate token transactions by buying or selling here.",
    },
    {
      element: "#p2p-page-tour",
      intro: "Now go to P2P Trader.",
    },
  ],
};
