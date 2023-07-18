# CryptHub

[CryptHub](https://crypthub-app.vercel.app) is a powerful web application designed for tracking and monitoring cryptocurrency prices and trends. It provides users with live chart data, showcasing both historical and real-time market information. With CryptHub, users can analyze the performance of various cryptocurrencies over time and make informed investment decisions.

CryptHub offers a user-friendly interface that displays interactive charts, allowing users to explore historical price movements, identify patterns, and stay updated with live market data. Whether you're a seasoned trader or a crypto enthusiast, CryptHub equips you with the tools and information necessary to navigate the cryptocurrency market effectively.

Please note that CryptHub does not provide news content. However, it focuses on delivering accurate and up-to-date cryptocurrency price data and comprehensive charting features. Join CryptHub today to leverage its live chart data and make informed decisions in the dynamic world of cryptocurrencies.

## Table of Contents

- [Project Links](#project-links)
  - [Landing Page](#landing-page)
  - [Web App](#web-app)
- [Colour Palette](#colour-palette)
  - [Light](#light)
  - [Dark](#dark)
- [Features](#features)
- [Getting Started](#getting-started)
- [Technologies Used](#technologies-used)
- [File Structure Overview](#file-structure-overview)
  - [Main Folder](#main-folders)
  - [Details](#details)

## Project Links

### Landing Page

- Website: [crypthub.vercel.app](https://crypthub.vercel.app/)
- Github Repository: [jia-wei-00/crypthub-landingpage](https://github.com/jia-wei-00/crypthub-landingpage)

### Web App

- Website: [crypthub-app.vercel.app](https://crypthub-app.vercel.app/)
- Github Repository: [jia-wei-00/DRC-FE-CryptHub-](https://github.com/jia-wei-00/DRC-FE-CryptHub-)

## Colour Palette

### Light

- [Colour Palette Link](https://colorhunt.co/palette/a27b5ce9e0d1ffffff000000)
- | Image                                                                                                                                |  Primary  | Secondary | Tertiary  | Quaternary |
  | ------------------------------------------------------------------------------------------------------------------------------------ | :-------: | --------: | --------- | ---------- |
  | [<img src="./src/assets/light.png" alt="Light Palette" style="width: 50px;">](https://colorhunt.co/palette/a27b5ce9e0d1ffffff000000) | `#A27B5C` | `#E9E0D1` | `#FFFFFF` | `#000000`  |

### Dark

- [Colour Palette Link](https://colorhunt.co/palette/3f4e4fa27b5cffffff000000)
- | Image                                                                                                                               |  Primary  | Secondary | Tertiary  | Quaternary |
  | ----------------------------------------------------------------------------------------------------------------------------------- | :-------: | --------: | --------- | ---------- |
  | [<img src="./src/assets/dark.png" alt="Light Palette" style="width: 50px;">](https://colorhunt.co/palette/a27b5ce9e0d1ffffff000000) | `#3F4E4F` | `#A27B5C` | `#FFFFFF` | `#000000`  |

## Features

- **Live Cryptocurrency Price Tracking**: Stay informed with real-time updates on cryptocurrency prices.

- **Real-time Market Data Updates**: Access the latest market data to make informed investment decisions.

- **Interactive Charts and Graphs**: Visualize cryptocurrency trends and analyze market movements with interactive charts and graphs.

- **P2P Trading Functionality**: Facilitate direct cryptocurrency trades with other CryptHub users in a secure and user-friendly environment.

- **User-friendly and Intuitive Interface**: Enjoy a seamless and intuitive user interface designed to enhance the user experience.

## Getting Started

To clone CryptHub, follow these steps:

1. Clone the repository:

   ```bash
   git clone git@github.com:jia-wei-00/DRC-FE-CryptHub-.git
   ```

2. Install Dependencies:

   ```bash
   npm install
   ```

3. Run the app:

   ```bash
   npm start
   ```

## Technologies Used

CryptHub is built using the following technologies:

- [React](https://react.dev/)\
  A popular JavaScript library for building user interfaces. We use React to build our app.

- [TypeScript](https://www.typescriptlang.org/)\
  A strongly typed superset of JavaScript that adds static typing to the language. We use TypeScript with React for this project.

- [Vite](https://vitejs.dev/)\
  A fast and lightweight build tool for modern web applications. We use this building tool to speed up the development process.

- [Material UI](https://mui.com/)\
  A widely used UI component library for React applications. We use this library for most of our components, such as inputs, containers, navigation bars, and more.

- [Framer Motion](https://www.framer.com/motion/)\
  A library for creating smooth and interactive animations in React. We use this library to animate our transitions.

- [Axios](https://axios-http.com/docs/intro)\
  A promise-based HTTP client for making API requests. We use this library to establish a connection with the backend server.

- [Dayjs](https://day.js.org/)\
  A lightweight JavaScript library for date and time manipulation. We use this library to handle date and time conversions used in the history table.

- [Highcharts](https://www.highcharts.com/)\
  A feature-rich charting library for interactive data visualization. We use this library to display live data on the trading page.

- [Intro.js](https://introjs.com/docs)\
  A step-by-step guide to introduce new users to the application's features. We use this library for our onboarding tour guide to familiarize users with our app's flow.

- [Mobx](https://mobx.js.org/README.html)\
  A simple and scalable state management library for JavaScript applications. We use this state management library due to its excellent performance and simplicity. We use multiple stores in our project, such as mode-store, history-store, trade-store, and more.

- [Mobx Persist Store](https://www.npmjs.com/package/mobx-persist-store)\
  A library for persisting Mobx store data. We use this to store user preferences like dark mode and light mode toggle value, and chart display settings.

- [React Hook Form](https://react-hook-form.com/)\
  A library for building forms in React with easy form validation. We use this library for its excellent performance, as it only triggers rerendering when necessary.

- [React Loading](https://www.npmjs.com/package/react-loading)\
  A library for displaying loading spinners in React applications. We use this library for our loading animation when fetching data from the API.

- [React Number Format](https://s-yadav.github.io/react-number-format/docs/intro/)\
  A library for formatting numbers in input fields. We use this library for formatting the currency input field. We've created a reusable component that includes add and subtract buttons, which is located in the components folder named "numeric-input.tsx".

- [Sass](https://sass-lang.com/)\
  A CSS preprocessor that adds power and elegance to CSS. We use this preprocessor because Sass allows us to do nesting in CSS code, use mixins, functions, and more.

- [Zod](https://zod.dev/)\
  A TypeScript-first schema validation library for runtime type checking. We use this validation library for all of our forms, such as register form, login form, reset password form, buy form, sell form, and more. We use Zod combined with react-hook-form and Material UI input to minimize rerendering while performing proper validation and displaying error messages returned from the Zod library.

- [JS Cookie](https://github.com/js-cookie/js-cookie#readme)\
  A library for handling cookies in JavaScript. We use this for storing user tokens.

- [React Toastify](https://fkhadra.github.io/react-toastify/introduction)\
  A popular notification library for React applications, offering easy and customizable toast notifications. We use this library for all of our notification messages, such as error messages, success messages, and loading notifications.

## File Structure Overview

### Main Folders

### `src`

The `src` folder contains the main source code of the application. It is organized into the following subfolders:

- `assets`: Stores all the project's assets (images and icons).
- `components`: Contains reusable components (forms, inputs, popup dialogs).
- `pages`: Houses page components.
- `schemas`: Stores validation schemas using Zod.
- `stores`: Contains MobX store-related files.
- `styles`: Stores SCSS files for styling.
- `types`: Contains TypeScript type definitions.

### Details

- `src`: Contains the main source code of the application.
  - `assets`: Stores all the project's assets (images and icons).
  - `components`: Contains reusable components (forms, inputs, popup dialogs).
  - `pages`: Houses page components.
    - `home`: Components for the home page.
    - `p2p`: Components for the P2P page.
    - `profile`: Components for the user profile page.
    - `error`: Components for handling page-not-found scenarios.
  - `schema`: Stores validation schemas using Zod.
  - `store`: Contains MobX store-related files.
    - `auth-store`: Handles authentication functions and data.
    - `history-store`: Manages transaction history-related functions and data.
    - `loading-store`: Handles loading state when fetching data from APIs.
    - `modal-store`: Controls reusable global popup modals.
    - `mode-store`: Manages light/dark mode toggle and uses MobX Persist Store to store the mode locally.
    - `p2p-store`: Handles P2P function and data.
    - `p2p-websocket-store`: Manages WebSocket calls and data for live trading in the P2P page.
    - `tour-store`: Handles onboarding tour guide using Intro.js.
    - `wallet-store`: Manages wallet data and functions.
    - `websocket-store`: Handles live chart data for the CryptHub page.
  - `styles`: Stores SCSS files for styling.
  - `types`: Contains TypeScript type definitions.
  - `auth.tsx`: Handles authentication navigation.
  - `constants.tsx`: Stores constant data (page constants, request headers, onboarding tour descriptions, etc.).
  - `functions.tsx`: Houses reusable functions (error handling, success message handling, request timeout handling, etc.).
  - `theme.tsx`: Stores theme palette settings for Material UI.
- `.env`: Contains the API key.
