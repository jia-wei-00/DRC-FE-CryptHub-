import { object, number, ZodType } from "zod";
import { walletStore, websocketStoreP2P } from "../stores";

export const addP2PSchema: (coin_amount: number) => ZodType = (coin_amount) =>
  object({
    coin_amount: number()
      .positive("Amount must be a positive number")
      .max(
        walletStore.wallet[
          websocketStoreP2P.currency as keyof typeof walletStore.wallet
        ],
        "Amount must be less than or equal to wallet balance"
      ),
    price: number()
      .positive("Amount must be a positive number")
      .max(
        coin_amount,
        "Amount must be less than or equal to current market price"
      ),
  });
