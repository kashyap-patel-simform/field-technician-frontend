import { API_ENDPOINTS } from "@/constants";
import { httpClient, unwrap } from "@/lib/http/http-client";
import { clearAccessToken, setAccessToken } from "@/lib/http/token-store";
import type { Technician } from "@/features/auth/types/auth.types";
import type { ApiSuccessResponse } from "@/types/api.types";

interface AuthSessionPayload {
  technician: Technician;
  accessToken: string;
}

export async function sendOtp(mobileNumber: string): Promise<void> {
  await httpClient.post<ApiSuccessResponse<{ sent: boolean }>>(
    API_ENDPOINTS.AUTH.SEND_OTP,
    { mobileNumber },
  );
}

export async function verifyOtp(
  mobileNumber: string,
  otp: string,
): Promise<AuthSessionPayload> {
  const response = await httpClient.post<
    ApiSuccessResponse<AuthSessionPayload>
  >(API_ENDPOINTS.AUTH.VERIFY_OTP, { mobileNumber, otp });
  const session = unwrap(response);
  setAccessToken(session.accessToken);
  return session;
}

export async function refreshSession(): Promise<AuthSessionPayload> {
  const response = await httpClient.post<
    ApiSuccessResponse<AuthSessionPayload>
  >(API_ENDPOINTS.AUTH.REFRESH);
  const session = unwrap(response);
  setAccessToken(session.accessToken);
  return session;
}

export async function logout(): Promise<void> {
  try {
    await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } finally {
    clearAccessToken();
  }
}
