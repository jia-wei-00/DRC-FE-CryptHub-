import { Button, Container, Grid, Stack } from "@mui/material";
import React from "react";
import "../../styles/pages/p2p.scss";
import ItemCard from "./item-card";
import { motion } from "framer-motion";

const P2P: React.FC = () => {
  const [active, setActive] = React.useState("market");

  return (
    <Container maxWidth="xl" className="p2p-container">
      <div className="filter">P2P</div>
      <div className="market-card">
        <Stack direction="row" className="p2p-head-stack">
          <Button onClick={() => setActive("market")}>Marketplace</Button>
          <Button onClick={() => setActive("ongoing")}>On Going</Button>
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
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
          <Grid item xs={2} sm={4} md={3}>
            <ItemCard />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default P2P;
