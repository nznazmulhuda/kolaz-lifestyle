"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, Phone, Shield } from "lucide-react";
import { toast } from "react-hot-toast";
import { redirect, RedirectType } from "next/navigation";

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Format for Bangladesh numbers
    if (digits.startsWith("880")) {
      return "+" + digits;
    } else if (digits.startsWith("1") && digits.length <= 10) {
      return "+880" + digits;
    } else if (digits.length > 0 && !digits.startsWith("880")) {
      return "+880" + digits.slice(-10);
    }
    return "+880";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.length <= 14) {
      setPhoneNumber(formatted);
    }
  };

  const handleSendOTP = async () => {
    if (phoneNumber.length < 14) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("OTP sent to your number");
      setStep(2);
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsVerifying(true);

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setShowSuccess(true);
      toast.success("OTP Verified! Redirecting to dashboard...");

      // Simulate redirect after success message
      setTimeout(() => {
        redirect("/dashboard", RedirectType.push);
      }, 2000);
    }, 2000);
  };

  const handleBackToPhone = () => {
    setStep(1);
    setOtp(["", "", "", "", "", ""]);
    setShowSuccess(false);
  };

  const handleResendOTP = () => {
    toast.success("OTP resent to your number");
    setOtp(["", "", "", "", "", ""]);
    otpRefs.current[0]?.focus();
  };

  useEffect(() => {
    if (step === 2) {
      // Auto-focus first OTP input when step 2 appears
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 300);
    }
  }, [step]);

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Login Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                You will be redirected to your dashboard shortly.
              </p>
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-[#e11d48]" />
                <span className="ml-2 text-sm text-gray-500">
                  Redirecting...
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e11d48] rounded-full mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">K</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">KoLaz</h1>
          <p className="text-gray-600 text-sm mt-1">Fashion Forward</p>
        </div>

        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-[#e11d48]/5 to-[#e11d48]/10">
            <div className="w-12 h-12 bg-[#e11d48]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              {step === 1 ? (
                <Phone className="w-6 h-6 text-[#e11d48]" />
              ) : (
                <Shield className="w-6 h-6 text-[#e11d48]" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === 1 ? "Login to KoLaz" : "Verify OTP"}
            </CardTitle>
            <CardDescription className="text-base">
              {step === 1
                ? "Enter your phone number to get started"
                : `We've sent a 6-digit code to ${phoneNumber}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {/* Step 1: Phone Number */}
            <div
              className={`transition-all duration-500 ease-out ${
                step === 1
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4 absolute inset-0 pointer-events-none"
              }`}
            >
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+8801XXXXXXXXX"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className="text-lg h-12 pl-4 border-2 border-gray-200 focus:border-[#e11d48] focus:ring-[#e11d48]/20"
                      maxLength={14}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={isLoading || phoneNumber.length < 14}
                  className="w-full h-12 text-base font-semibold bg-[#e11d48] hover:bg-[#e11d48]/90 shadow-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </div>
            </div>

            {/* Step 2: OTP Verification */}
            <div
              className={`transition-all duration-500 ease-out ${
                step === 2
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 absolute inset-0 pointer-events-none"
              }`}
            >
              <div className="space-y-6">
                {/* Back Button */}
                <Button
                  variant="ghost"
                  onClick={handleBackToPhone}
                  className="p-0 h-auto text-sm text-gray-600 hover:text-[#e11d48] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Change phone number
                </Button>

                {/* OTP Input */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Enter 6-digit OTP
                  </Label>
                  <div className="flex gap-3 justify-center">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 focus:border-[#e11d48] focus:ring-[#e11d48]/20"
                      />
                    ))}
                  </div>
                </div>

                {/* Verify Button */}
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isVerifying || otp.join("").length !== 6}
                  className="w-full h-12 text-base font-semibold bg-[#e11d48] hover:bg-[#e11d48]/90 shadow-lg transition-all duration-200"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>

                {/* Resend OTP */}
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600 mb-3">
                    Didn't receive the code?
                  </p>
                  <Button
                    variant="link"
                    onClick={handleResendOTP}
                    className="p-0 h-auto text-[#e11d48] hover:text-[#e11d48]/80 font-semibold text-sm"
                  >
                    Resend OTP
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p className="mb-2">By continuing, you agree to our</p>
          <div className="flex justify-center gap-4">
            <button className="text-[#e11d48] hover:underline font-medium">
              Terms of Service
            </button>
            <span>•</span>
            <button className="text-[#e11d48] hover:underline font-medium">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
