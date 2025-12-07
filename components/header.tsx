"use client"

import { useAuth } from './auth/auth-provider'
import LogoutButton from './auth/logout-button'
import Link from 'next/link'

export default function Header() {
  const { user, loading } = useAuth()

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Loan Products</h1>
          </Link>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="text-sm text-slate-500">Loading...</div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">
                    {user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

