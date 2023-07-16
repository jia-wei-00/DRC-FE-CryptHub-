import { Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "./theme";
import "./styles/main.scss";
import { authStore, modeStore, tourStore } from "./stores";
import { observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import { Nav } from "./components";
import { homeTour, pages } from "./constant";
import { ErrorPage, Profile } from "./pages";
import Auth from "./auth";
import React from "react";
import { Steps } from "intro.js-react";
import { TourDialog } from "./components/dialog";
import { useMediaQuery } from "@mui/material";

const App: React.FC = () => {
  const navigate = useNavigate();
  const matches = useMediaQuery("(max-width:600px)");

  const [initialStep] = React.useState(0);

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
          enabled={tourStore.tour.home}
          steps={homeTour.steps}
          initialStep={initialStep}
          onExit={() => tourStore.setTour({ home: false })}
          options={homeTour.options}
          onBeforeExit={(step) => {
            if (step === 4) {
              navigate("/p2pTrader");
              setTimeout(() => {
                tourStore.setTour({ p2p: true });
              }, 500);
            }
          }}
        />
        {!matches && authStore.user && <TourDialog />}
      </ThemeProvider>
    </div>
  );
};

export default observer(App);
