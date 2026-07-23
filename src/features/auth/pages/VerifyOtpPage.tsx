import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageSquareText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { AUTH_CONSTANTS, ROUTES, VALIDATION_MESSAGES, ERROR_MESSAGES } from '@/constants'
import { sendOtp, verifyOtp } from '@/features/auth/api/auth.api'
import { useAuth } from '@/features/auth/hooks/useAuth'

const otpSchema = z.object({
  otp: z.string().length(AUTH_CONSTANTS.OTP_LENGTH, VALIDATION_MESSAGES.INVALID_OTP),
})

type OtpFormValues = z.infer<typeof otpSchema>

export function VerifyOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const mobileNumber = (location.state as { mobileNumber?: string } | null)
    ?.mobileNumber

  const [serverError, setServerError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState<number>(AUTH_CONSTANTS.RESEND_COOLDOWN_SECONDS)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  })

  useEffect(() => {
    if (cooldown === 0) return
    const timer = setInterval(() => {
      setCooldown((seconds) => Math.max(0, seconds - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  if (!mobileNumber) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  async function onSubmit(values: OtpFormValues) {
    setServerError(null)
    try {
      const { technician, accessToken } = await verifyOtp(mobileNumber!, values.otp)
      login(technician, accessToken)
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : ERROR_MESSAGES.VERIFY_OTP_FAILED)
      setValue('otp', '')
    }
  }

  async function handleResend() {
    setServerError(null)
    setCooldown(AUTH_CONSTANTS.RESEND_COOLDOWN_SECONDS)
    await sendOtp(mobileNumber!)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <button
        type="button"
        aria-label="Back"
        onClick={() => navigate(ROUTES.LOGIN)}
        className="-ml-2 flex size-10 items-center justify-center rounded-full text-foreground active:bg-muted"
      >
        <ArrowLeft className="size-5" />
      </button>

      <div className="flex flex-1 flex-col justify-center gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <MessageSquareText className="size-8" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Verify OTP</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to
            <br />
            <span className="font-medium text-foreground">+91 {mobileNumber}</span>
          </p>
        </div>

        <form
          id="otp-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4"
        >
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={AUTH_CONSTANTS.OTP_LENGTH}
                value={field.value}
                onChange={field.onChange}
                onComplete={() => handleSubmit(onSubmit)()}
              >
                <InputOTPGroup>
                  {Array.from({ length: AUTH_CONSTANTS.OTP_LENGTH }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="size-12 text-lg"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && (
            <p className="text-sm text-destructive">{errors.otp.message}</p>
          )}
          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <Button
            type="button"
            variant="link"
            disabled={cooldown > 0}
            onClick={handleResend}
            className="text-sm"
          >
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
          </Button>
        </form>
      </div>

      <Button
        type="submit"
        form="otp-form"
        disabled={isSubmitting}
        size="lg"
        className="h-12 w-full text-base"
      >
        {isSubmitting ? 'Verifying…' : 'Verify & Login'}
      </Button>
    </div>
  )
}
