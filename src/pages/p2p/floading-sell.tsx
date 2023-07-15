import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { StorefrontRounded } from "@mui/icons-material";
import { authStore } from "../../stores";
import { SellOnMarkerPlace } from "../../components";
import { BooleanState } from "../../types";

const SellButton: React.FC<BooleanState> = ({ state, setState }) => {
  const handleSellModal = () => {
    if (authStore.user === null) {
      return authStore.setAuthModal(true);
    }
    setState(!state);
  };

  return (
    <>
      <Box className="market-sell-box" onClick={handleSellModal}>
        <Fab variant="extended" className="sell-button">
          <StorefrontRounded />
          Sell
        </Fab>
      </Box>

      <SellOnMarkerPlace sellModal={state} setSellModal={setState} />
    </>
  );
};

export default SellButton;
