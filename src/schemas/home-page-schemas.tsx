import { number, object, ZodType } from "zod";

export const priceSchema: (value: number) => ZodType = (value) =>
  object({
    price: number()
      .positive()
      .max(value!, "Price cannot exceed wallet balance"),
  });
