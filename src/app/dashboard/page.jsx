'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [title, setTitle] = useState('')
  const [quizzes, setQuizzes] = useState([])

  const fetchQuizzes = async () => {
    const { data } = await supabase.from('quizzes').select('*')
    setQuizzes(data)
  }

  const createQuiz = async () => {
    await supabase.from('quizzes').insert({ title })
    setTitle('')
    fetchQuizzes()
  }

  useEffect(() => {
    fetchQuizzes()
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="border p-2"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={createQuiz}
          className="bg-blue-600 text-white px-4"
        >
          Create Quiz
        </button>
      </div>

      <ul>
        {quizzes.map(q => (
          <li key={q.id} className="border p-2 mb-2">
            {q.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
