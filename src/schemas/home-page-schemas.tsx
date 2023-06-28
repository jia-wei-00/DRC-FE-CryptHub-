import { number, object, ZodType } from "zod";

export const priceSchema: (value: number) => ZodType = (value) =>
  object({
    price: number().min(1).max(value!, "Price cannot exceed wallet balance"),
  });
