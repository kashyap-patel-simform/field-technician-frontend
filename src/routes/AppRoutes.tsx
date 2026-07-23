import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const VerifyOtpPage = lazy(() =>
  import('@/features/auth/pages/VerifyOtpPage').then((m) => ({
    default: m.VerifyOtpPage,
  })),
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Suspense>
  )
}
