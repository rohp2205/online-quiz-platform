'use client'

import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const QUIZ_TIME = 600 // 10 minutes

export default function QuizAttempt() {
  const { quizId } = useParams()

  const [quizTitle, setQuizTitle] = useState('')
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [name, setName] = useState('')
  const [leaderboard, setLeaderboard] = useState([])
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchQuiz()
    fetchQuestions()
    fetchLeaderboard()
  }, [])

  /* ⏱ TIMER */
  useEffect(() => {
    if (submitted) return

    if (timeLeft === 0) {
      submitQuiz(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, submitted])

  /* FETCH QUIZ TITLE */
  const fetchQuiz = async () => {
    const { data } = await supabase
      .from('quizzes')
      .select('title')
      .eq('id', quizId)
      .single()

    setQuizTitle(data?.title || 'Online Quiz')
  }

  /* FETCH QUESTIONS */
  const fetchQuestions = async () => {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)

    setQuestions(data || [])
  }

  /* FETCH LEADERBOARD */
  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('results')
      .select('*')
      .eq('quiz_id', quizId)
      .order('score', { ascending: false })

    setLeaderboard(data || [])
  }

  const selectAnswer = (qid, option) => {
    if (submitted) return
    setAnswers({ ...answers, [qid]: option })
  }

  /* SUBMIT QUIZ */
  const submitQuiz = async (auto = false) => {
    if (submitted) return
    if (!name && !auto) {
      toast.error('Please enter your name')
      return
    }

    setSubmitted(true)

    let totalScore = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_option) {
        totalScore++
      }
    })

    setScore(totalScore)

    await supabase.from('results').insert({
      quiz_id: quizId,
      student_name: name || 'Anonymous',
      score: totalScore,
      total: questions.length,
    })

    fetchLeaderboard()
    toast.success('Quiz submitted successfully')
  }

  /* RESULT VIEW */
  if (score !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10">
        <h1 className="text-3xl font-bold mb-2 text-center">
          🎉 {quizTitle}
        </h1>

        <p className="text-center text-xl mb-8">
          Score: <b>{score}</b> / {questions.length}
        </p>

        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            🏆 Leaderboard
          </h2>

          <ul>
            {leaderboard.map((r, i) => (
              <li
                key={r.id}
                className="flex justify-between border-b border-white/10 py-2"
              >
                <span>{i + 1}. {r.student_name}</span>
                <span>{r.score}/{r.total}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  /* QUIZ VIEW */
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pb-20">

      {/* TOP BAR */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/10 px-8 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">{quizTitle}</h1>
        <span className="text-red-400 font-semibold">
          ⏱ {timeLeft}s
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-8">

        {/* NAME */}
        <input
          placeholder="Enter your name"
          className="w-full mb-8 p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitted}
        />

        {/* QUESTIONS */}
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="mb-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <p className="text-sm text-gray-400 mb-2">
              Question {index + 1} of {questions.length}
            </p>

            <h2 className="text-lg font-semibold mb-4">
              {q.question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['a', 'b', 'c', 'd'].map((opt) => {
                const selected = answers[q.id] === opt

                return (
                  <div
                    key={opt}
                    onClick={() => selectAnswer(q.id, opt)}
                    className={`cursor-pointer p-4 rounded-xl border transition
                      ${
                        selected
                          ? 'border-purple-500 bg-purple-600/20'
                          : 'border-white/20 hover:border-purple-400'
                      }`}
                  >
                    {q[`option_${opt}`]}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* SUBMIT */}
        <div className="text-center">
          <button
            onClick={() => submitQuiz(false)}
            disabled={submitted}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition"
          >
            ✅ Submit Quiz
          </button>
        </div>
      </div>
    </div>
  )
}
