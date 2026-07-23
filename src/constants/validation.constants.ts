export const VALIDATION_PATTERNS = {
  MOBILE_NUMBER: /^[6-9]\d{9}$/,
  OTP: /^\d{6}$/,
} as const

export const VALIDATION_MESSAGES = {
  INVALID_MOBILE: 'Enter a valid 10-digit mobile number',
  INVALID_OTP: 'Enter the 6-digit OTP',
  REQUIRED_FIELD: 'This field is required',
} as const
