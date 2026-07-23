import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTES, VALIDATION_PATTERNS, VALIDATION_MESSAGES, ERROR_MESSAGES } from '@/constants'
import { sendOtp } from '@/features/auth/api/auth.api'

const loginSchema = z.object({
  mobileNumber: z
    .string()
    .trim()
    .regex(VALIDATION_PATTERNS.MOBILE_NUMBER, VALIDATION_MESSAGES.INVALID_MOBILE),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { mobileNumber: '' },
  })

  async function onSubmit(values: LoginFormValues) {
    setServerError(null)
    try {
      await sendOtp(values.mobileNumber)
      navigate(ROUTES.VERIFY_OTP, { state: { mobileNumber: values.mobileNumber } })
    } catch {
      setServerError(ERROR_MESSAGES.SEND_OTP_FAILED)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-1 flex-col justify-center gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Wrench className="size-8" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Technician Login
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your mobile number to receive a one-time password
          </p>
        </div>

        <form
          id="login-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <div className="flex items-center gap-2">
            <span className="flex h-12 items-center rounded-md border border-input bg-muted px-3 text-base text-muted-foreground">
              +91
            </span>
            <Input
              id="mobileNumber"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="9876543210"
              maxLength={10}
              autoFocus
              className="h-12 flex-1 text-base"
              aria-invalid={!!errors.mobileNumber}
              {...register('mobileNumber')}
            />
          </div>
          {errors.mobileNumber && (
            <p className="text-sm text-destructive">
              {errors.mobileNumber.message}
            </p>
          )}
          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}
        </form>
      </div>

      <Button
        type="submit"
        form="login-form"
        disabled={isSubmitting}
        size="lg"
        className="h-12 w-full text-base"
      >
        {isSubmitting ? 'Sending OTP…' : 'Send OTP'}
      </Button>
    </div>
  )
}
