"use client";

import { forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Phone, Shield, User, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Country selector component
export function CountrySelector({
  countries,
  loading,
  value,
  onValueChange,
  error,
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Country</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="country">Country</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            "w-full",
            error && "border-destructive focus:ring-destructive"
          )}
        >
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.dialCode}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{country.flag}</span>
                <span>{country.name}</span>
                <Badge variant="secondary" className="ml-auto">
                  {country.dialCode}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}

// Phone input component
export const PhoneInput = forwardRef(
  ({ placeholder = "Enter phone number", error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={ref}
            type="tel"
            placeholder={placeholder}
            className={cn(
              "pl-10",
              error && "border-destructive focus:ring-destructive"
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error.message}</p>}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

// OTP input component
export function OTPInput({ value, onChange, error, disabled }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <Shield className="mx-auto h-12 w-12 text-primary mb-2" />
        <Label className="text-base font-medium">Enter Verification Code</Label>
        <p className="text-sm text-muted-foreground mt-1">
          We&apos;ve sent a 6-digit code to your phone
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error.message}</p>
      )}
    </div>
  );
}

// Form field wrapper
export function FormField({ label, error, children, required = false }) {
  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {children}
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}

// Step indicator
export function StepIndicator({ currentStep, steps, className }) {
  return (
    <div className={cn("flex justify-center mb-6", className)}>
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isCompleted =
            steps.findIndex((s) => s.key === currentStep) > index;

          return (
            <div key={step.key} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  isActive &&
                    "border-primary bg-primary text-primary-foreground",
                  isCompleted &&
                    "border-primary bg-primary text-primary-foreground",
                  !isActive &&
                    !isCompleted &&
                    "border-muted-foreground bg-background"
                )}
              >
                {isCompleted ? (
                  <span className="text-sm">✓</span>
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-2",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Auth card wrapper
export function AuthCard({
  title,
  description,
  children,
  showBack = false,
  onBack,
  icon: Icon,
}) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="card-elevated">
        <CardHeader className="text-center space-y-4">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="self-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}

          {Icon && (
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}

          <div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            {description && (
              <CardDescription className="text-base mt-2">
                {description}
              </CardDescription>
            )}
          </div>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

// Loading button with spinner
export function LoadingButton({
  loading,
  children,
  loadingText = "Loading...",
  icon: Icon,
  ...props
}) {
  return (
    <Button disabled={loading} {...props}>
      {loading ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          {children}
        </>
      )}
    </Button>
  );
}

// Resend OTP button
export function ResendButton({ onResend, cooldown, loading, disabled }) {
  const canResend = cooldown === 0 && !loading && !disabled;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onResend}
      disabled={!canResend}
      className="w-full"
    >
      {loading ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : cooldown > 0 ? (
        `Resend in ${cooldown}s`
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Resend Code
        </>
      )}
    </Button>
  );
}
