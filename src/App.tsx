import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "./theme";
import "./styles/main.scss";
import { authStore, modeStore } from "./stores";
import { observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import { Nav } from "./components";
import { pages } from "./constant";
import { ErrorPage, Profile } from "./pages";
import Auth from "./auth";
import React from "react";
import { Steps } from "intro.js-react";
import "intro.js/introjs.css";

const App: React.FC = () => {
  const [stepsEnabled, setStepsEnabled] = React.useState(true);
  const [initialStep] = React.useState(0);
  const [tour] = React.useState({
    options: {
      showProgress: true,
    },
    steps: [
      {
        element: "#profile",
        intro: "Profile with all transaction history and account settings",
      },
      {
        element: "#wallet",
        intro: "Wallet",
      },
      {
        element: "#dark-light-toggle",
        intro: "Tittel film liste",
      },
    ],
  });

  return (
    <div id={modeStore.mode}>
      <ThemeProvider theme={modeStore.mode === "dark" ? darkTheme : lightTheme}>
        <Nav />
        <Auth>
          <Routes>
            {pages.map((page, index) => {
              return (
                <Route key={index} path={page.path} element={page.element} />
              );
            })}
            <Route path="*" element={<ErrorPage />} />
            {authStore.user !== null && (
              <Route path="/profile" element={<Profile />} />
            )}
          </Routes>
        </Auth>

        <ToastContainer
          theme={modeStore.mode === "dark" ? "dark" : "light"}
          position="top-center"
        />
        <Steps
          enabled={stepsEnabled}
          steps={tour.steps}
          initialStep={initialStep}
          onExit={() => setStepsEnabled(false)}
          options={tour.options}
        />
      </ThemeProvider>
    </div>
  );
};

export default observer(App);
