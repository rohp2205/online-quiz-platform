'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

/* 🔘 REUSABLE GLOW BUTTON */
function GlowButton({ children, onClick, variant = 'primary' }) {
  const base =
    'relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500'

  const variants = {
    primary:
      'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg hover:shadow-purple-500/40 hover:scale-105',
    ghost:
      'border border-white/20 text-white hover:bg-white/10 backdrop-blur'
  }

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      <span className="absolute inset-0 rounded-xl blur-xl opacity-0 hover:opacity-60 bg-purple-500 transition" />
    </button>
  )
}

/* 🧩 FEATURE CARD (CLICKABLE) */
function FeatureCard({ icon, title, desc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white/10 backdrop-blur rounded-xl p-6 text-center
                 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/20
                 transition active:scale-95"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          🧠 <span>Online Quiz Platform</span>
        </div>

        <GlowButton
          variant="ghost"
          onClick={() => router.push('/login')}
        >
          👨‍💼 Admin Login
        </GlowButton>
      </header>

      {/* HERO SECTION */}
      <section className="text-center px-6 pt-24">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Learn. <span className="text-purple-400">Test.</span> Improve.
        </h1>

        <p className="max-w-2xl mx-auto text-gray-300 text-lg">
          A modern online quiz platform with real-time evaluation,
          analytics, leaderboards, and secure exams.
        </p>

        {/* MAIN CTA */}
        <div className="flex justify-center mt-12">
          <GlowButton onClick={() => router.push('/login')}>
            🚀 Admin Panel
          </GlowButton>
        </div>
      </section>

      {/* FEATURES SECTION (NOW WORKING) */}
      <section className="mt-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

          {/* TIMED EXAMS */}
          <FeatureCard
            icon="⏱"
            title="Timed Exams"
            desc="Real exam-like environment with auto-submit and countdown timer."
            onClick={() =>
              toast('⏱ Timed exams auto-submit when the timer ends.', {
                icon: '⏱'
              })
            }
          />

          {/* ANALYTICS */}
          <FeatureCard
            icon="📊"
            title="Analytics"
            desc="Admin dashboard with quiz stats, attempts, and performance insights."
            onClick={() => router.push('/dashboard/analytics')}
          />

          {/* LEADERBOARDS */}
          <FeatureCard
            icon="🏆"
            title="Leaderboards"
            desc="Motivate students with rankings and instant result visibility."
            onClick={() => router.push('/dashboard/analytics')}
          />

        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-sm mt-32 py-6 border-t border-white/10">
        © 2026 Online Quiz Platform | Built with Next.js & Supabase
      </footer>
    </div>
  )
}
