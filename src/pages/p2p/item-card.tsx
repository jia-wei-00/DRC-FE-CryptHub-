import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Bitcoin from "../../assets/bitcoin.svg";
import Ethereum from "../../assets/ethereum.svg";
import { ItemCardT } from "../../types";

const ItemCard: React.FC<ItemCardT> = ({ active, array }) => {
  return (
    <Card className="market-card">
      <CardMedia
        component="img"
        alt="green iguana"
        height="100"
        sx={{ objectFit: "contain" }}
        image={array === "BTC" ? Bitcoin : Ethereum}
      />
      <CardContent className="card-content">
        <Typography gutterBottom variant="h5" component="div">
          {array}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Amount: 0.04
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: 3000
        </Typography>
      </CardContent>

      <CardActions sx={{ display: "flex", justifyContent: "center" }}>
        {active === "market" ? (
          <Button size="small">BUY</Button>
        ) : (
          <Button size="small">WITHDRAW</Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ItemCard;
