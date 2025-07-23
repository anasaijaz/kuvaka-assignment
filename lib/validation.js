import { z } from "zod";

// Phone number validation schema
export const phoneSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

// OTP validation schema
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

// User profile schema for signup
export const userProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name must contain only letters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name must contain only letters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
});

// Complete signup schema
export const signupSchema = phoneSchema.merge(userProfileSchema);

// Login schema (just phone)
export const loginSchema = phoneSchema;

// Combined phone + OTP schema for verification
export const phoneOtpSchema = phoneSchema.merge(otpSchema);

// Country schema for API response
export const countrySchema = z.object({
  name: z.object({
    common: z.string(),
    official: z.string(),
  }),
  cca2: z.string(),
  cca3: z.string(),
  idd: z.object({
    root: z.string(),
    suffixes: z.array(z.string()).optional(),
  }),
  flag: z.string(),
  flags: z.object({
    png: z.string(),
    svg: z.string(),
  }),
});

export const countriesSchema = z.array(countrySchema);

// Form step validation
export const stepValidationSchema = {
  phone: phoneSchema,
  otp: otpSchema,
  profile: userProfileSchema,
};

// Error messages
export const errorMessages = {
  required: "This field is required",
  invalidPhone: "Please enter a valid phone number",
  invalidOtp: "Please enter a valid 6-digit OTP",
  invalidEmail: "Please enter a valid email address",
  invalidName: "Name must contain only letters",
  networkError: "Network error. Please check your connection.",
  otpExpired: "OTP has expired. Please request a new one.",
  otpInvalid: "Invalid OTP. Please try again.",
  phoneExists: "This phone number is already registered.",
  serverError: "Something went wrong. Please try again.",
};
