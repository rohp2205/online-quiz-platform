'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    const { data } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false })

    setQuizzes(data || [])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-12">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-3 tracking-wide">
          🧠 Available Quizzes
        </h1>
        <p className="text-gray-400">
          Test your knowledge. Beat the leaderboard. Learn faster.
        </p>
      </div>

      {/* QUIZ GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.map((quiz, index) => (
          <div
            key={quiz.id}
            className="group relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:border-purple-500"
          >
            {/* CARD NUMBER */}
            <div className="absolute -top-4 -right-4 bg-purple-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-lg">
              {index + 1}
            </div>

            {/* QUIZ TITLE */}
            <h2 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition">
              {quiz.title}
            </h2>

            {/* QUIZ META */}
            <div className="text-sm text-gray-400 mb-6 space-y-1">
              <p>⏱ Timed Quiz</p>
              <p>📊 Instant Result</p>
              <p>🏆 Leaderboard Enabled</p>
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={() => router.push(`/quiz/${quiz.id}`)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white tracking-wide transition-all hover:from-purple-700 hover:to-blue-700"
            >
              🚀 Start Quiz
            </button>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {quizzes.length === 0 && (
        <p className="text-center text-gray-500 mt-20">
          No quizzes available right now.
        </p>
      )}
    </div>
  )
}
