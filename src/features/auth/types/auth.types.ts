export interface Technician {
  id: string
  mobileNumber: string
}

export interface AuthState {
  technician: Technician | null
  accessToken: string | null
}
