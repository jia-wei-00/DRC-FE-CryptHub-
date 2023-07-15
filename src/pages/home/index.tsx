import React from "react";
import Chart from "./chart";
import "../../styles/pages/home.scss";
import Action from "./action";
import { Fab } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { ChartSettingsDialog } from "../../components";
import { motion } from "framer-motion";

const Home = () => {
  const [openSettings, setOpenSettings] = React.useState<boolean>(false);

  return (
    <div className="chart-container">
      <Chart />
      <motion.div
        initial={{ opacity: 0, translateY: "100%" }}
        animate={{ opacity: 1, translateY: 0 }}
        className="action-column"
      >
        <Action />

        <motion.div
          whileHover={{ rotate: 90 }}
          whileTap={{
            rotate: -90,
            borderRadius: "100%",
          }}
          animate={{
            translateY: "-45px",
            translateX: "5px",
          }}
          className="floating-icon"
        >
          <Fab
            size="small"
            color="secondary"
            aria-label="add"
            onClick={() => setOpenSettings(!openSettings)}
          >
            <Settings />
          </Fab>
        </motion.div>
      </motion.div>

      <ChartSettingsDialog state={openSettings} setState={setOpenSettings} />
    </div>
  );
};

export default Home;
