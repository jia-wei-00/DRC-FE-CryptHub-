import React from "react";
import Chart from "./chart";
import "../../styles/pages/home.scss";
import Action from "./action";
import { Fab } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { ChartSettingsDialog } from "../../components";

const Home = () => {
  const [openSettings, setOpenSettings] = React.useState<boolean>(false);

  return (
    <div className="chart-container">
      <Chart />
      <div className="action-column">
        <Action />
        <Fab
          size="small"
          color="secondary"
          aria-label="add"
          className="floating-icon"
          onClick={() => setOpenSettings(!openSettings)}
        >
          <Settings />
        </Fab>
      </div>

      <ChartSettingsDialog
        openSettings={openSettings}
        setOpenSettings={setOpenSettings}
      />
    </div>
  );
};

export default Home;
