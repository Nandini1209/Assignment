import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = LoginSchema.parse(body)
    
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Ensure user exists in users table
    if (data.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      // Create user record if it doesn't exist
      if (!userData) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email!,
          display_name: data.user.user_metadata?.display_name || null,
        })
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

