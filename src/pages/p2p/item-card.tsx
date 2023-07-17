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
import { authStore, modalStore, p2pStore } from "../../stores";
import { observer } from "mobx-react-lite";

const ItemCard: React.FC<ItemCardT> = ({ active, contract }) => {
  return (
    <>
      <Card className="market-card">
        {authStore.user !== null &&
          authStore.user.id === contract.seller_id &&
          active === "market" && <div className="owned-contract" />}

        <CardMedia
          component="img"
          alt="green iguana"
          height="100"
          sx={{ objectFit: "contain" }}
          image={contract.currency === "BTC" ? Bitcoin : Ethereum}
        />
        <CardContent className="card-content">
          <Typography gutterBottom variant="h5" component="div">
            {contract.currency}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Amount: {contract.coin_amount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: {contract.selling_price}
          </Typography>
        </CardContent>

        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          {active === "market" ? (
            <Button
              size="small"
              onClick={() =>
                modalStore.setConfirmationModal(
                  () => p2pStore.buyContract(contract),
                  "buy_p2p",
                  null,
                  "USD",
                  contract.currency,
                  contract.coin_amount,
                  contract.selling_price
                )
              }
              disabled={
                authStore.user !== null &&
                authStore.user.id === contract.seller_id
              }
            >
              BUY
            </Button>
          ) : (
            <Button
              size="small"
              onClick={() =>
                modalStore.setConfirmationModal(
                  () => p2pStore.withdrawContract(contract),
                  "delete",
                  null,
                  null,
                  contract.currency,
                  contract.coin_amount,
                  null
                )
              }
            >
              Delete
            </Button>
          )}
        </CardActions>
      </Card>
    </>
  );
};

export default observer(ItemCard);
