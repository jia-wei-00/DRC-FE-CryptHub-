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
import { SellOnMarkerPlace } from "../../components";

const P2P: React.FC = () => {
  const [active, setActive] = React.useState("market");
  const [checked, setChecked] = React.useState([true, true]);
  const [sellModal, setSellModal] = React.useState(false);

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked]);
  };

  const dummyArray = [
    "ETH",
    "BTC",
    "BTC",
    "BTC",
    "BTC",
    "ETH",
    "BTC",
    "ETH",
    "BTC",
    "ETH",
    "ETH",
    "ETH",
    "ETH",
    "BTC",
    "BTC",
    "BTC",
    "BTC",
    "ETH",
    "BTC",
    "ETH",
    "BTC",
    "ETH",
    "ETH",
    "ETH",
  ];

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

  const filteredArray = dummyArray.filter((item) => {
    if (checked[0] && checked[1]) {
      return true; // Show all items if both checkboxes are checked
    } else if (checked[0] && item === "ETH") {
      return true; // Show only "ETH" items if the "ETH" checkbox is checked
    } else if (checked[1] && item === "BTC") {
      return true; // Show only "BTC" items if the "BTC" checkbox is checked
    }
    return false;
  });

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
            style={active !== "market" ? { color: "#a27b5c" } : {}}
          >
            Marketplace
          </Button>
          <Button
            onClick={() => setActive("ongoing")}
            style={active !== "ongoing" ? { color: "#a27b5c" } : {}}
          >
            On Going
          </Button>
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
          {filteredArray.map((array) => (
            <Grid item xs={2} sm={4} md={3}>
              <ItemCard active={active} array={array} />
            </Grid>
          ))}
        </Grid>
      </div>

      <SellButton />
    </Container>
  );
};

export default P2P;
