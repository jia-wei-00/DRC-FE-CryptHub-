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
      intro:
        "This section displays the current market price for ETH and BTC based on your input coin amount.",
    },
    {
      element: "#wallet-currency-select",
      intro: "Please select the currency you wish to sell.",
    },
    {
      element: ".sell-p2p-input-field",
      intro:
        "Here, you can input the amount of coins you want to sell and set the selling price.",
    },
    {
      element: "#sell-on-p2p",
      intro:
        "Once you have filled the necessary details, you can create the contract and start trading.",
    },
  ],
};

export const P2PTour = {
  options: introjsOptions,
  steps: [
    {
      element: ".filter",
      intro:
        "You can use this feature to filter the market based on ETH or BTC.",
    },
    {
      element: "#market-tour",
      intro:
        "This section displays all available contracts on the marketplace.",
    },
    {
      element: "#ongoing-tour",
      intro:
        "Here, you can view all the contracts you have created on the marketplace.",
    },
    {
      element: ".market-sell-box",
      intro: "This button allows you to sell your contract on the marketplace.",
    },
  ],
};

export const homeTour = {
  options: introjsOptions,
  steps: [
    {
      element: "#profile-button",
      intro:
        "By clicking this button, you can access a comprehensive transaction history and efficiently manage your profile.",
    },
    {
      element: "#wallet",
      intro:
        "In this section, you can gain insights into your wallet balance, facilitate deposits, and execute withdrawals.",
    },
    {
      element: "#dark-light-toggle",
      intro: "This toggle enables you to switch between light and dark themes.",
    },
    {
      element: "#home-page-tour",
      intro: "Welcome to the Crypthub trader page.",
    },
    {
      element: "#chart-settings",
      intro:
        "Here, you can customize the currency, chart type, and interval for optimal visualization and analysis.",
    },
    {
      element: "#buy-sell",
      intro:
        "You can initiate token transactions, either by buying or selling, from this section.",
    },
    {
      element: "#p2p-page-tour",
      intro: "Let's move on to the P2P Trader page.",
    },
  ],
};
