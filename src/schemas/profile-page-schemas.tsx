import { ZodType, object, string } from "zod";

export const resetSchema: ZodType = object({
  old_password: string()
    .nonempty("Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  password: string()
    .nonempty("Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).*$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one symbol, and one digit"
    ),
  new_password: string().nonempty("Please confirm your password"),
}).refine((data) => data.password === data.new_password, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});
