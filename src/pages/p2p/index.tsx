import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import "../../styles/pages/p2p.scss";
import ItemCard from "./item-card";
import { motion } from "framer-motion";
import SellButton from "./floading-sell";
import { observer } from "mobx-react-lite";
import p2pStore from "../../stores/p2p-store";
import { authStore } from "../../stores";
import { ConfirmationPopUp } from "../../components";

const P2P: React.FC = () => {
  const [active, setActive] = React.useState("market");
  const [checked, setChecked] = React.useState([true, true]);

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked]);
  };

  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
      <FormControlLabel
        label="ETH"
        control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
      />
      <FormControlLabel
        label="BTC"
        control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
      />
    </Box>
  );

  React.useEffect(() => {
    if (authStore.user === null) {
      setActive("market");
    }
    if (active === "market") {
      p2pStore.fetchP2PMarket();
    } else if (active === "ongoing") {
      if (authStore.user === null) return;
      p2pStore.fetchOnGoingContracts();
    }
  }, [active, authStore.user, authStore.wallet]);

  return (
    <Container maxWidth="xl" className="p2p-container">
      <div className="filter">
        <Typography variant="body1">Filter</Typography>
        <Divider />
        <div>
          <FormControlLabel
            label="Currency"
            control={
              <Checkbox
                checked={checked[0] && checked[1]}
                indeterminate={checked[0] !== checked[1]}
                onChange={handleChange1}
              />
            }
          />
          {children}
        </div>
      </div>
      <div className="market-card">
        <Stack direction="row" className="p2p-head-stack">
          <Button
            onClick={() => setActive("market")}
            style={
              authStore.user === null
                ? { width: "50%" }
                : active !== "market"
                ? { color: "#a27b5c" }
                : {}
            }
          >
            Marketplace
          </Button>
          {authStore.user !== null && (
            <Button
              onClick={() => setActive("ongoing")}
              style={active !== "ongoing" ? { color: "#a27b5c" } : {}}
            >
              On Going
            </Button>
          )}
          <motion.div
            className="p2p-indicator"
            animate={active === "market" ? { x: 0 } : { x: "100%" }}
          />
        </Stack>

        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 8, md: 12 }}
        >
          {active === "market"
            ? p2pStore.p2p_contracts
                .filter((contract) => {
                  if (checked[0] && checked[1]) {
                    return true; // Show all items if both checkboxes are checked
                  } else if (checked[0] && contract.currency === "ETH") {
                    return true; // Show only "ETH" items if the "ETH" checkbox is checked
                  } else if (checked[1] && contract.currency === "BTC") {
                    return true; // Show only "BTC" items if the "BTC" checkbox is checked
                  }
                  return false;
                })
                .map((contract, index) => (
                  <Grid item xs={2} sm={4} md={3} key={index}>
                    <ItemCard active={active} contract={contract} />
                  </Grid>
                ))
            : p2pStore.p2p_ongoing_contracts
                .filter((contract) => {
                  if (checked[0] && checked[1]) {
                    return true; // Show all items if both checkboxes are checked
                  } else if (checked[0] && contract.currency === "ETH") {
                    return true; // Show only "ETH" items if the "ETH" checkbox is checked
                  } else if (checked[1] && contract.currency === "BTC") {
                    return true; // Show only "BTC" items if the "BTC" checkbox is checked
                  }
                  return false;
                })
                .map((contract, index) => (
                  <Grid item xs={2} sm={4} md={3} key={index}>
                    <ItemCard active={active} contract={contract} />
                  </Grid>
                ))}
        </Grid>
      </div>
      <SellButton />
      <ConfirmationPopUp />
    </Container>
  );
};

export default observer(P2P);
