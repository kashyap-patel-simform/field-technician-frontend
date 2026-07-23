import { AUTH_CONSTANTS, API_CONSTANTS, ERROR_MESSAGES } from '@/constants'
import type { Technician } from '@/features/auth/types/auth.types'

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendOtp(mobileNumber: string): Promise<{ success: true }> {
  if (!mobileNumber) {
    throw new Error('Mobile number is required.')
  }
  await wait(API_CONSTANTS.SIMULATED_DELAY_MS)
  return { success: true }
}

export async function verifyOtp(
  mobileNumber: string,
  otp: string,
): Promise<{ technician: Technician; accessToken: string }> {
  await wait(API_CONSTANTS.SIMULATED_DELAY_MS)

  if (otp !== AUTH_CONSTANTS.DEMO_OTP) {
    throw new Error(ERROR_MESSAGES.INVALID_OTP)
  }

  return {
    technician: { id: mobileNumber, mobileNumber },
    accessToken: `demo-token-${mobileNumber}`,
  }
}
