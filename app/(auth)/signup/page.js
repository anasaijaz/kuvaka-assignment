"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Shield, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCountries, useOTPFlow } from "@/lib/auth-hooks";
import { useAppStore } from "@/lib/store";
import {
  AuthCard,
  CountrySelector,
  PhoneInput,
  PhoneInputWithCountry,
  OTPInput,
  StepIndicator,
  LoadingButton,
  ResendButton,
  FormField,
} from "@/components/auth/form-components";

const steps = [
  { key: "phone", label: "Phone" },
  { key: "otp", label: "Verify" },
  { key: "profile", label: "Profile" },
];

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();
  const { countries, loading: countriesLoading } = useCountries();

  const {
    step,
    phoneNumber,
    otpLoading,
    verifyLoading,
    resendCooldown,
    phoneForm,
    otpForm,
    profileForm,
    sendOTP,
    verifyOTP,
    completeRegistration,
    resendOTP,
    goBack,
  } = useOTPFlow("signup");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handlePhoneSubmit = async (data) => {
    await sendOTP(data);
  };

  const handleOTPSubmit = async (data) => {
    await verifyOTP(data);
  };

  const handleProfileSubmit = async (data) => {
    await completeRegistration(data);
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    return phone.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d+)/, "$1 $2 $3 $4");
  };

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Step Indicator */}
        <StepIndicator currentStep={step} steps={steps} className="mb-8" />

        {step === "phone" && (
          <AuthCard
            title="Create Account"
            description="Sign up for a new account using your phone number"
            icon={Phone}
          >
            <form
              onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
              className="space-y-6"
            >
              <PhoneInputWithCountry
                countries={countries}
                countriesLoading={countriesLoading}
                countryValue={phoneForm.watch("countryCode")}
                onCountryChange={(value) =>
                  phoneForm.setValue("countryCode", value)
                }
                phoneProps={phoneForm.register("phoneNumber")}
                countryError={phoneForm.formState.errors.countryCode}
                phoneError={phoneForm.formState.errors.phoneNumber}
                placeholder="Enter your phone number"
              />

              <LoadingButton
                type="submit"
                loading={otpLoading}
                loadingText="Sending OTP..."
                className="w-full btn-filled"
                icon={Phone}
              >
                Send OTP
              </LoadingButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </AuthCard>
        )}

        {step === "otp" && (
          <AuthCard
            title="Verify Phone"
            description={`Enter the code sent to ${formatPhoneNumber(
              phoneNumber
            )}`}
            showBack
            onBack={goBack}
            icon={Shield}
          >
            <form
              onSubmit={otpForm.handleSubmit(handleOTPSubmit)}
              className="space-y-6"
            >
              <OTPInput
                value={otpForm.watch("otp")}
                onChange={(value) => otpForm.setValue("otp", value)}
                error={otpForm.formState.errors.otp}
                disabled={verifyLoading}
              />

              <div className="space-y-3">
                <LoadingButton
                  type="submit"
                  loading={verifyLoading}
                  loadingText="Verifying..."
                  className="w-full btn-filled"
                  disabled={
                    !otpForm.watch("otp") || otpForm.watch("otp").length !== 6
                  }
                >
                  Verify Code
                </LoadingButton>

                <ResendButton
                  onResend={resendOTP}
                  cooldown={resendCooldown}
                  loading={otpLoading}
                />
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <button
                  type="button"
                  onClick={goBack}
                  className="text-primary hover:underline font-medium"
                >
                  Change phone number
                </button>
              </p>
            </div>
          </AuthCard>
        )}

        {step === "profile" && (
          <AuthCard
            title="Complete Profile"
            description="Tell us a bit about yourself to complete your account"
            showBack
            onBack={goBack}
            icon={User}
          >
            <form
              onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  error={profileForm.formState.errors.firstName}
                  required
                >
                  <Input
                    {...profileForm.register("firstName")}
                    placeholder="John"
                    className={
                      profileForm.formState.errors.firstName
                        ? "border-destructive"
                        : ""
                    }
                  />
                </FormField>

                <FormField
                  label="Last Name"
                  error={profileForm.formState.errors.lastName}
                  required
                >
                  <Input
                    {...profileForm.register("lastName")}
                    placeholder="Doe"
                    className={
                      profileForm.formState.errors.lastName
                        ? "border-destructive"
                        : ""
                    }
                  />
                </FormField>
              </div>

              <FormField
                label="Email (Optional)"
                error={profileForm.formState.errors.email}
              >
                <Input
                  {...profileForm.register("email")}
                  type="email"
                  placeholder="john.doe@example.com"
                  className={
                    profileForm.formState.errors.email
                      ? "border-destructive"
                      : ""
                  }
                />
              </FormField>

              <LoadingButton
                type="submit"
                loading={profileForm.formState.isSubmitting}
                loadingText="Creating account..."
                className="w-full btn-filled"
                icon={User}
              >
                Complete Registration
              </LoadingButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our{" "}
                <button className="text-primary hover:underline">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-primary hover:underline">
                  Privacy Policy
                </button>
              </p>
            </div>
          </AuthCard>
        )}
      </div>
    </div>
  );
}
