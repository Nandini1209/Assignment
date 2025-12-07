import SignupForm from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <SignupForm />
      </div>
    </main>
  )
}

