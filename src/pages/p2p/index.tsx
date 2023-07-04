import { Container } from "@mui/material";
import React from "react";
import "../../styles/pages/p2p.scss";
import ItemCard from "./item-card";

const P2P: React.FC = () => {
  return (
    <Container maxWidth="xl" className="p2p-container">
      <div className="filter">P2P</div>
      <div className="market-card">
        <ItemCard />
      </div>
    </Container>
  );
};

export default P2P;
