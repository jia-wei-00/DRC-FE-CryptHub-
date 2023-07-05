import { object, number, ZodType } from "zod";

export const addP2PSchema: (
  current_price: number,
  coin_amount: number
) => ZodType = (current_price, coin_amount) =>
  object({
    coin_amount: number()
      .positive("Amount must be a positive number")
      .max(5, "Amount must be less than or equal to 5"),
    price: number()
      .positive("Amount must be a positive number")
      .max(
        coin_amount * current_price,
        "Amount must be less than or equal to current market price"
      ),
  });
