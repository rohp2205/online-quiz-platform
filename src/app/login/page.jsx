'use client'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')

  const login = async () => {
    await supabase.auth.signInWithOtp({ email })
    alert('Check your email for login link')
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 border rounded w-80">
        <h1 className="text-xl mb-4">Admin Login</h1>
        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={login}
          className="mt-4 bg-black text-white w-full py-2"
        >
          Login
        </button>
      </div>
    </div>
  )
}
