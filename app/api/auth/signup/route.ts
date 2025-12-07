import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, displayName } = SignupSchema.parse(body)
    
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create user record in users table
    if (data.user) {
      const { error: dbError } = await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email!,
        display_name: displayName || null,
      })

      if (dbError) {
        // If user already exists, that's okay (might be a race condition)
        console.error('Error creating user record:', dbError)
      }
    }

    return NextResponse.json({ user: data.user })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }
    const errorMessage = err instanceof Error ? err.message : 'Invalid request'
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}

