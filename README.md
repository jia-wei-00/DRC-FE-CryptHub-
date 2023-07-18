# CryptHub

[CryptHub](https://crypthub-app.vercel.app) is a powerful web application designed for tracking and monitoring cryptocurrency prices and trends. It provides users with live chart data, showcasing both historical and real-time market information. With CryptHub, users can analyze the performance of various cryptocurrencies over time and make informed investment decisions.

CryptHub offers a user-friendly interface that displays interactive charts, allowing users to explore historical price movements, identify patterns, and stay updated with live market data. Whether you're a seasoned trader or a crypto enthusiast, CryptHub equips you with the tools and information necessary to navigate the cryptocurrency market effectively.

Please note that CryptHub does not provide news content. However, it focuses on delivering accurate and up-to-date cryptocurrency price data and comprehensive charting features. Join CryptHub today to leverage its live chart data and make informed decisions in the dynamic world of cryptocurrencies.

## Table of Contents

- [Project Links](#project-links)
- [Colour Palette](#colour-palette)
- [Features](#features)
- [Getting Started](#getting-started)
- [Technologies Used](#technologies-used)

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
- | Image                                                                                                                                | Primary | Secondary | Tertiary | Quaternary |
  | ------------------------------------------------------------------------------------------------------------------------------------ | :-----: | --------: | -------- | ---------- |
  | [<img src="./src/assets/light.png" alt="Light Palette" style="width: 50px;">](https://colorhunt.co/palette/a27b5ce9e0d1ffffff000000) | #A27B5C |   #E9E0D1 | #FFFFFF  | #000000    |

### Dark

- [Colour Palette Link](https://colorhunt.co/palette/3f4e4fa27b5cffffff000000)
- | Image                                                                                                                               | Primary | Secondary | Tertiary | Quaternary |
  | ----------------------------------------------------------------------------------------------------------------------------------- | :-----: | --------: | -------- | ---------- |
  | [<img src="./src/assets/dark.png" alt="Light Palette" style="width: 50px;">](https://colorhunt.co/palette/a27b5ce9e0d1ffffff000000) | #3F4E4F |   #A27B5C | #FFFFFF  | #000000    |

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

- [React](https://react.dev/)

  A popular JavaScript library for building user interfaces. We use React to build out app.

- [Typescript](https://www.typescriptlang.org/)

  A strongly typed superset of JavaScript that adds static typing to the language. We use React Typescript for this project.

- [Vite](https://vitejs.dev/)

  A fast and lightweight build tool for modern web applications. We use this building tools for fastened the development process.

- [Material UI](https://mui.com/)

  A widely used UI component library for React applications. We use this library for most of our component like input, container, navigation bar and etc.

- [Framer Motion](https://www.framer.com/motion/)

  A library for creating smooth and interactive animations in React. We use this library for animate our transition.

- [Axios](https://axios-http.com/docs/intro)

  A promise-based HTTP client for making API requests. We use this library to have connection with back-end server.

- [Dayjs](https://day.js.org/)

  A lightweight JavaScript library for date and time manipulation. We use this library for convertion of the date and time used on the history table.

- [Highcharts](https://www.highcharts.com/)

  A feature-rich charting library for interactive data visualization. We use this library for displaying the live data on the trading page.

- [Intro.js](https://introjs.com/docs)

  A step-by-step guide to introduce new users to the application's features. We use this libtary for out onboarding tour guide to let user familiar with our app flow.

- [Mobx](https://mobx.js.org/README.html)

  A simple and scalable state management library for JavaScript applications. We use this state management library because of the excellent performance and simplicity, We use multiple store in our project like mode-store, history-store, trade-store, and etc.

- [Mobx Persist Store](https://www.npmjs.com/package/mobx-persist-store)

  A library for persisting Mobx store data. We use this to store user preferences like darkmode and lightmode toggle value, and chart display settings.

- [React Hook Form](https://react-hook-form.com/)

  A library for building forms in React with easy form validation. We use this library because of the excellent performance. It will only trigger rerendering when is necessary.

- [React Loading](https://www.npmjs.com/package/react-loading)

  A library for displaying loading spinners in React applications. We use this library for our loading animation when we fetching out data from the api.

- [React Number Format](https://s-yadav.github.io/react-number-format/docs/intro/)

  A library for formatting numbers in input fields. We use this library for formatting the currency input field. We created a reusable components that have add and subtract button build in inside components folder "numeric-input.tsx"

- [Sass](https://sass-lang.com/)

  A CSS preprocessor that adds power and elegance to CSS. We use this preprocessor because sass allow to do nesting in css code, mixin, function, and etc.

- [Zod](https://zod.dev/)

  A TypeScript-first schema validation library for runtime type checking. We use this validation library for all of our form like register form, login form, reset password form, buy form, sell form, and etc. We use zod combine with react-hook-form and Material UI input to minimal the rerending while doing proper validation and displaying the error return from zod library.

- [JS Cookie](https://github.com/js-cookie/js-cookie#readme)

  A library for handling cookies in JavaScript. We ue this for storing user token.

- [React Toastify](https://fkhadra.github.io/react-toastify/introduction)

  A popular notification library for React applications, offering easy and customizable toast notifications. We use this library for all of our notification messages like error message, success message, and loading.

Feel free to explore and leverage these technologies to enhance your own projects.
