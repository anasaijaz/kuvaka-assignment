"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
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
} from "@/components/auth/form-components";

const steps = [
  { key: "phone", label: "Phone" },
  { key: "otp", label: "Verify" },
];

export default function LoginPage() {
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
    sendOTP,
    verifyOTP,
    resendOTP,
    goBack,
  } = useOTPFlow("login");

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
            title="Welcome Back"
            description="Sign in to your account using your phone number"
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
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
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
                  Verify & Sign In
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
      </div>
    </div>
  );
}
