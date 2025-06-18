import { useMutation, useQuery } from "@tanstack/react-query";
import {
  authApi,
  type LoginCredentials,
  type RegisterCredentials,
  type VerifyAccountData,
  type SendResetOtpData,
  type ResetPasswordData,
  // type User,
} from "../lib/api";

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authApi.register(credentials),
  });
}

export function useMe() {
  const token = localStorage.getItem("token");
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.me(),
    retry: false,
    enabled: !!token,
  });
}

export function useSendVerifyOtp() {
  return useMutation({
    mutationFn: () => authApi.sendVerifyOtp(),
  });
}

export function useVerifyAccount() {
  return useMutation({
    mutationFn: (data: VerifyAccountData) => authApi.verifyAccount(data),
  });
}

export function useIsAuth() {
  const token = localStorage.getItem("token");
  return useQuery({
    queryKey: ["isAuth"],
    queryFn: () => authApi.isAuth(),
    retry: false,
    enabled: !!token,
  });
}

export function useSendResetOtp() {
  return useMutation({
    mutationFn: (data: SendResetOtpData) => authApi.sendResetOtp(data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordData) => authApi.resetPassword(data),
  });
}
