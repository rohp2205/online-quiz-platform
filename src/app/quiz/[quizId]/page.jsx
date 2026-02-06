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
  const [name, setName] = useState('')
  const [score, setScore] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME)
  const [submitted, setSubmitted] = useState(false)
  const [showResult, setShowResult] = useState(false)

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    fetchQuiz()
    fetchQuestions()
    fetchLeaderboard()
  }, [])

  /* ---------------- TIMER ---------------- */
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

  /* ---------------- FETCH ---------------- */
  const fetchQuiz = async () => {
    const { data } = await supabase
      .from('quizzes')
      .select('title')
      .eq('id', quizId)
      .single()

    setQuizTitle(data?.title || 'Online Quiz')
  }

  const fetchQuestions = async () => {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)

    setQuestions(data || [])
  }

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('results')
      .select('*')
      .eq('quiz_id', quizId)
      .order('score', { ascending: false })

    setLeaderboard(data || [])
  }

  /* ---------------- ANSWER SELECT ---------------- */
  const selectAnswer = (qid, option) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qid]: option }))
  }

  /* ---------------- CLEAR ---------------- */
  const clearForm = () => {
    if (submitted) return
    setName('')
    setAnswers({})
    toast.success('Form cleared')
  }

  /* ---------------- SUBMIT ---------------- */
  const submitQuiz = async (auto = false) => {
    if (submitted) return

    if (!name && !auto) {
      toast.error('Please enter your name')
      return
    }

    let totalScore = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_option) totalScore++
    })

    setScore(totalScore)
    setSubmitted(true)

    await supabase.from('results').insert({
      quiz_id: quizId,
      student_name: name || 'Anonymous',
      score: totalScore,
      total: questions.length,
    })

    fetchLeaderboard() // ✅ IMPORTANT
    toast.success('Quiz submitted! Review answers below 👇')
  }

  /* ---------------- OPTION STYLE ---------------- */
  const getOptionStyle = (q, opt) => {
    if (!submitted) {
      return answers[q.id] === opt
        ? 'border-purple-500 bg-purple-600/20'
        : 'border-white/20 hover:border-purple-400'
    }

    if (opt === q.correct_option) {
      return 'border-green-500 bg-green-600/30'
    }

    if (answers[q.id] === opt && opt !== q.correct_option) {
      return 'border-red-500 bg-red-600/30'
    }

    return 'border-white/20 opacity-60'
  }

  /* ---------------- RESULT PAGE ---------------- */
  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10">
        <h1 className="text-3xl font-bold text-center mb-2">🎉 {quizTitle}</h1>
        <p className="text-center text-xl mb-8">
          Score: <b>{score}</b> / {questions.length}
        </p>

        <div className="max-w-xl mx-auto bg-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">🏆 Leaderboard</h2>
          <ul>
            {leaderboard.map((r, i) => (
              <li key={r.id} className="flex justify-between py-2 border-b border-white/10">
                <span>{i + 1}. {r.student_name}</span>
                <span>{r.score}/{r.total}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  /* ---------------- QUIZ PAGE ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pb-24">

      {/* TOP BAR */}
      <div className="sticky top-0 bg-black/80 px-8 py-4 flex justify-between">
        <h1 className="font-bold">{quizTitle}</h1>
        <span className="text-red-400">⏱ {timeLeft}s</span>
      </div>

      {/* SCORE SHOWN HERE ✅ */}
      {submitted && (
        <div className="max-w-4xl mx-auto mt-6 px-6">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <h2 className="text-xl font-bold">
              🎯 Your Score: <span className="text-green-400">{score}</span> / {questions.length}
            </h2>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submitQuiz(false)
        }}
        className="max-w-4xl mx-auto px-6 pt-8"
      >
        <input
          placeholder="Enter your name"
          className="w-full mb-8 p-3 rounded bg-white/10 border border-white/20"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitted}
        />

        {questions.map((q, index) => (
          <div key={q.id} className="mb-10 bg-white/10 rounded-2xl p-6">
            <p className="text-gray-400 mb-2">
              Question {index + 1} of {questions.length}
            </p>

            <h2 className="text-lg font-semibold mb-4">{q.question}</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {['a', 'b', 'c', 'd'].map((opt) => (
                <div
                  key={opt}
                  onClick={() => selectAnswer(q.id, opt)}
                  className={`cursor-pointer p-4 rounded-xl border transition ${getOptionStyle(q, opt)}`}
                >
                  <div className="flex justify-between">
                    <span>{q[`option_${opt}`]}</span>
                    {submitted && opt === q.correct_option && <span className="text-green-400">✔</span>}
                    {submitted && answers[q.id] === opt && opt !== q.correct_option && <span className="text-red-400">✖</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-center gap-4">
          <button type="button" onClick={clearForm} disabled={submitted}
            className="px-8 py-3 bg-gray-600 rounded">
            🧹 Clear Form
          </button>

          <button type="submit" disabled={submitted}
            className="px-10 py-3 bg-green-600 rounded font-semibold">
            ✅ Submit Quiz
          </button>
        </div>

        {submitted && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setShowResult(true)}
              className="px-8 py-3 bg-blue-600 rounded-xl"
            >
              📊 View Result
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
