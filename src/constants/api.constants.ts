export const API_CONSTANTS = {
  SIMULATED_DELAY_MS: 800,
} as const

export const ERROR_MESSAGES = {
  SEND_OTP_FAILED: 'Unable to send OTP. Please try again.',
  VERIFY_OTP_FAILED: 'Verification failed.',
  INVALID_OTP: 'Invalid OTP. Please try again.',
} as const
