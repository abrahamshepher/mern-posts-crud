import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, type VerifyOtpFormData } from "../lib/schemas";
import { useSendVerifyOtp, useVerifyAccount } from "../hooks/useAuth";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function EmailVerification() {
  const [step, setStep] = useState<"send" | "verify">("send");

  const sendOtpMutation = useSendVerifyOtp();
  const verifyOtpMutation = useVerifyAccount();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const handleSendOtp = async () => {
    try {
      console.log("Sending OTP...");
      const response = await sendOtpMutation.mutateAsync();
      console.log("OTP response:", response);
      toast.success(response.message);
      setStep("verify");
    } catch (error) {
      console.error("OTP error:", error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const onSubmit = async (data: VerifyOtpFormData) => {
    try {
      console.log("Verifying OTP...", data);
      const response = await verifyOtpMutation.mutateAsync(data);
      console.log("Verify response:", response);
      toast.success(response.message);
      // Redirect to dashboard after successful verification
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error) {
      console.error("Verify error:", error);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Email Verification</h2>

      {step === "send" ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Click the button below to send a verification OTP to your email
            address.
          </p>
          <button
            onClick={handleSendOtp}
            disabled={sendOtpMutation.isPending}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {sendOtpMutation.isPending ? "Sending..." : "Send Verification OTP"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium">
              Enter OTP
            </label>
            <input
              {...register("otp")}
              type="text"
              placeholder="123456"
              maxLength={6}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Verifying..." : "Verify Account"}
          </button>

          <button
            type="button"
            onClick={() => setStep("send")}
            className="w-full rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Resend OTP
          </button>
        </form>
      )}
    </div>
  );
}
