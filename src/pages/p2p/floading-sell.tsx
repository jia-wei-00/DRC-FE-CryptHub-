import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { StorefrontRounded } from "@mui/icons-material";
import { SellOnMarkerPlace } from "../../components/dialog";

export default function SellButton() {
  const [sellModal, setSellModal] = React.useState(false);

  return (
    <>
      <Box className="market-sell-box" onClick={() => setSellModal(!sellModal)}>
        <Fab variant="extended" className="sell-button">
          <StorefrontRounded />
          Sell
        </Fab>
      </Box>

      <SellOnMarkerPlace sellModal={sellModal} setSellModal={setSellModal} />
    </>
  );
}
