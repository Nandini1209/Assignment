import LoginForm from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <LoginForm />
      </div>
    </main>
  )
}

