import { object, number, ZodType } from "zod";

export const depositSchema: ZodType = object({
  price: number()
    .positive("Amount must be a positive number")
    .max(30000, "Amount must be less than or equal to 30000"),
});
