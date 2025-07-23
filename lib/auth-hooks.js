"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAppStore } from "./store";
import { CountryService, OTPService, AuthService } from "./auth-service";
import { notify } from "./helpers";
import {
  phoneSchema,
  otpSchema,
  userProfileSchema,
  loginSchema,
  signupSchema,
} from "./validation";

// Hook for managing countries data
export function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const countriesData = await CountryService.getCountries();
        setCountries(countriesData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch countries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error, refetch: () => fetchCountries() };
}

// Main authentication hook
export function useAuth() {
  const router = useRouter();
  const { setUser, setLoading: setGlobalLoading } = useAppStore();

  const login = async (phoneNumber) => {
    try {
      setGlobalLoading(true);
      const result = await AuthService.loginUser(phoneNumber);

      if (result.success) {
        setUser(result.user);
        notify.success("Login successful!");
        router.push("/");
        return result;
      }
    } catch (error) {
      notify.error(error.message || "Login failed");
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setGlobalLoading(true);
      const result = await AuthService.registerUser(userData);

      if (result.success) {
        setUser(result.user);
        notify.success("Account created successfully!");
        router.push("/");
        return result;
      }
    } catch (error) {
      notify.error(error.message || "Registration failed");
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const logout = async () => {
    try {
      setGlobalLoading(true);
      await AuthService.logout();
      setUser(null);
      notify.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      notify.error("Logout failed");
    } finally {
      setGlobalLoading(false);
    }
  };

  return { login, register, logout };
}

// Hook for OTP flow management
export function useOTPFlow(type = "login") {
  const [step, setStep] = useState("phone"); // 'phone', 'otp', 'profile'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { login, register } = useAuth();

  // Phone form
  const phoneForm = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: "",
      phoneNumber: "",
    },
  });

  // OTP form
  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Profile form (for signup)
  const profileForm = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  // Send OTP
  const sendOTP = async (data) => {
    try {
      setOtpLoading(true);
      const fullPhoneNumber = `${data.countryCode}${data.phoneNumber}`;

      // Check if user exists for login
      if (type === "login") {
        const { exists } = await AuthService.checkUserExists(fullPhoneNumber);
        if (!exists) {
          notify.error("No account found with this phone number");
          return;
        }
      } else {
        // Check if user already exists for signup
        const { exists } = await AuthService.checkUserExists(fullPhoneNumber);
        if (exists) {
          notify.error("Account already exists with this phone number");
          return;
        }
      }

      const result = await OTPService.sendOTP(fullPhoneNumber);

      if (result.success) {
        setPhoneNumber(fullPhoneNumber);
        setCountryCode(data.countryCode);
        setOtpSent(true);
        setStep("otp");
        startResendCooldown();
      }
    } catch (error) {
      notify.error(error.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (data) => {
    try {
      setVerifyLoading(true);
      const result = await OTPService.verifyOTP(phoneNumber, data.otp);

      if (result.success) {
        if (type === "login") {
          // Proceed with login
          await login(phoneNumber);
        } else {
          // Proceed to profile step for signup
          setStep("profile");
        }
      }
    } catch (error) {
      notify.error(error.message || "OTP verification failed");
    } finally {
      setVerifyLoading(false);
    }
  };

  // Complete registration
  const completeRegistration = async (profileData) => {
    try {
      const userData = {
        countryCode,
        phoneNumber: phoneNumber.replace(countryCode, ""),
        ...profileData,
      };

      await register(userData);
    } catch (error) {
      // Error is handled in the register function
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    if (resendCooldown > 0) return;

    try {
      setOtpLoading(true);
      const result = await OTPService.resendOTP(phoneNumber);

      if (result.success) {
        startResendCooldown();
        otpForm.reset();
      }
    } catch (error) {
      notify.error(error.message || "Failed to resend OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Start resend cooldown
  const startResendCooldown = () => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Go back to previous step
  const goBack = () => {
    if (step === "otp") {
      setStep("phone");
      setOtpSent(false);
      setPhoneNumber("");
      setCountryCode("");
      otpForm.reset();
    } else if (step === "profile") {
      setStep("otp");
    }
  };

  // Reset flow
  const resetFlow = () => {
    setStep("phone");
    setPhoneNumber("");
    setCountryCode("");
    setOtpSent(false);
    setResendCooldown(0);
    phoneForm.reset();
    otpForm.reset();
    profileForm.reset();
  };

  return {
    step,
    phoneNumber,
    countryCode,
    otpSent,
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
    resetFlow,
  };
}
