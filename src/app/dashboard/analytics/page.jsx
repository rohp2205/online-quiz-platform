'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Analytics() {
  const [stats, setStats] = useState({
    quizzes: 0,
    questions: 0,
    attempts: 0,
  })
  const [topScores, setTopScores] = useState([])
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchStats()
    fetchTopScores()
  }, [])

  const checkAuth = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) router.push('/login')
  }

  const fetchStats = async () => {
    const quizzes = await supabase.from('quizzes').select('*')
    const questions = await supabase.from('questions').select('*')
    const results = await supabase.from('results').select('*')

    setStats({
      quizzes: quizzes.data?.length || 0,
      questions: questions.data?.length || 0,
      attempts: results.data?.length || 0,
    })
  }

  const fetchTopScores = async () => {
    const { data } = await supabase
      .from('results')
      .select('*')
      .order('score', { ascending: false })
      .limit(5)

    setTopScores(data || [])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-10 py-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          📊 Admin Analytics
        </h1>
        <p className="text-gray-400">
          Monitor platform performance and top results
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Total Quizzes"
          value={stats.quizzes}
          icon="📝"
          gradient="from-purple-600 to-indigo-600"
        />
        <StatCard
          title="Total Questions"
          value={stats.questions}
          icon="❓"
          gradient="from-blue-600 to-cyan-600"
        />
        <StatCard
          title="Total Attempts"
          value={stats.attempts}
          icon="🚀"
          gradient="from-green-600 to-emerald-600"
        />
      </div>

      {/* TOP PERFORMERS */}
      <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-6 max-w-3xl">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          🏆 Top Performers
        </h2>

        {topScores.length === 0 && (
          <p className="text-gray-400">
            No quiz attempts yet.
          </p>
        )}

        <ul>
          {topScores.map((r, i) => (
            <li
              key={r.id}
              className="flex justify-between items-center py-3 px-4 mb-2 rounded-lg bg-black/40 border border-white/10 hover:border-purple-500 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <span className="font-medium">
                  {r.student_name}
                </span>
              </div>

              <span className="font-semibold text-green-400">
                {r.score}/{r.total}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ---------- COMPONENT ---------- */
function StatCard({ title, value, icon, gradient }) {
  return (
    <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400">{title}</span>
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-lg`}
        >
          {icon}
        </div>
      </div>
      <h3 className="text-4xl font-bold">{value}</h3>
    </div>
  )
}
