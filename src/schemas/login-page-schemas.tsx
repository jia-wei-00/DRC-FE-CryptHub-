import { object, string, ZodType } from "zod";

export const registerSchema: ZodType = object({
  name: string()
    .nonempty("Username is required")
    .regex(
      /^(?=.*[a-zA-Z])[a-zA-Z0-9]*$/,
      "Only character and number is allowed"
    )
    .min(5, "Username must be more than 5 characters")
    .max(12, "Username must be less than 12 characters"),
  email: string().nonempty("Email is required").email("Email is invalid"),
  password: string()
    .nonempty("Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).*$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one symbol, and one digit"
    ),
  passwordConfirm: string().nonempty("Please confirm your password"),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});

export const loginSchema: ZodType = object({
  email: string().nonempty("Email is required").email("Email is invalid"),
  password: string()
    .nonempty("Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const forgetPasswordSchema: ZodType = object({
  email: string().nonempty("Email is required").email("Email is invalid"),
});
