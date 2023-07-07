import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "./theme";
import "./styles/main.scss";
import { modeStore } from "./stores";
import { observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import { Nav } from "./components";
import { pages } from "./constant";
import { Profile } from "./pages";
import Auth from "./auth";

const App: React.FC = () => {
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

            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Auth>

        <ToastContainer
          theme={modeStore.mode === "dark" ? "dark" : "light"}
          limit={3}
          position="top-center"
        />
      </ThemeProvider>
    </div>
  );
};

export default observer(App);
