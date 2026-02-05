'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      
      {/* GLASS CARD */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          🧑‍💼 Admin Login
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Access the quiz management dashboard
        </p>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="block text-sm text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-8">
          <label className="block text-sm text-gray-400 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg tracking-wide hover:from-purple-700 hover:to-blue-700 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* FOOTER */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Authorized access only
        </p>
      </div>
    </div>
  )
}
