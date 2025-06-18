import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sendResetOtpSchema,
  resetPasswordSchema,
  type SendResetOtpFormData,
  type ResetPasswordFormData,
} from "../lib/schemas";
import { useSendResetOtp, useResetPassword } from "../hooks/useAuth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export function PasswordReset() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");

  const sendOtpMutation = useSendResetOtp();
  const resetPasswordMutation = useResetPassword();

  const emailForm = useForm<SendResetOtpFormData>({
    resolver: zodResolver(sendResetOtpSchema),
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleSendOtp = async (data: SendResetOtpFormData) => {
    try {
      const response = await sendOtpMutation.mutateAsync(data);
      toast.success(response.message);
      setEmail(data.email);
      setStep("reset");
      // Pre-fill the email in the reset form
      resetForm.setValue("email", data.email);
    } catch (error) {
      console.log(error);

      toast.error("Failed to send reset OTP. Please check your email address.");
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    try {
      const response = await resetPasswordMutation.mutateAsync(data);
      toast.success(response.message);
      // Redirect to login after successful password reset
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to reset password. Please check your OTP and try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Reset Password</h2>

      {step === "email" ? (
        <form
          onSubmit={emailForm.handleSubmit(handleSendOtp)}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              {...emailForm.register("email")}
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {emailForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={sendOtpMutation.isPending}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {sendOtpMutation.isPending ? "Sending..." : "Send Reset OTP"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Login here
            </Link>
          </p>
        </form>
      ) : (
        <form
          onSubmit={resetForm.handleSubmit(handleResetPassword)}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              {...resetForm.register("email")}
              type="email"
              value={email}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium">
              Enter OTP
            </label>
            <input
              {...resetForm.register("otp")}
              type="text"
              placeholder="123456"
              maxLength={6}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {resetForm.formState.errors.otp && (
              <p className="mt-1 text-sm text-red-600">
                {resetForm.formState.errors.otp.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium">
              New Password
            </label>
            <input
              {...resetForm.register("newPassword")}
              type="password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {resetForm.formState.errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {resetForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {resetPasswordMutation.isPending
              ? "Resetting..."
              : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => setStep("email")}
            className="w-full rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Back to Email
          </button>
        </form>
      )}
    </div>
  );
}
