'use client'

import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function AddQuestion() {
  const { quizId } = useParams()
  const router = useRouter()

  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState({
    a: '',
    b: '',
    c: '',
    d: '',
  })
  const [correct, setCorrect] = useState('')
  const [loading, setLoading] = useState(false)

  const addQuestion = async () => {
    if (!question || !correct) {
      toast.error('Please complete the question')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Saving question...')

    const { error } = await supabase.from('questions').insert({
      quiz_id: quizId,
      question,
      option_a: options.a,
      option_b: options.b,
      option_c: options.c,
      option_d: options.d,
      correct_option: correct,
    })

    toast.dismiss(loadingToast)
    setLoading(false)

    if (error) {
      toast.error('Failed to save question')
    } else {
      toast.success('Question added successfully')
      setQuestion('')
      setOptions({ a: '', b: '', c: '', d: '' })
      setCorrect('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">➕ Add Question</h1>
          <p className="text-gray-400">
            Create high-quality MCQs for your quiz
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="text-sm text-gray-300 hover:text-white"
        >
          ← Back
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">

        {/* QUESTION */}
        <label className="block text-sm text-gray-300 mb-2">
          Question
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter the question here..."
          rows={3}
          className="w-full mb-6 p-4 rounded-lg bg-black/40 border border-white/20 focus:outline-none focus:border-purple-500"
        />

        {/* OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {['a', 'b', 'c', 'd'].map((key) => (
            <div key={key}>
              <label className="block text-sm text-gray-300 mb-1">
                Option {key.toUpperCase()}
              </label>
              <input
                value={options[key]}
                onChange={(e) =>
                  setOptions({ ...options, [key]: e.target.value })
                }
                placeholder={`Enter option ${key.toUpperCase()}`}
                className="w-full p-3 rounded-lg bg-black/40 border border-white/20 focus:outline-none focus:border-purple-500"
              />
            </div>
          ))}
        </div>

        {/* CORRECT OPTION */}
        <label className="block text-sm text-gray-300 mb-3">
          Select Correct Answer
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {['a', 'b', 'c', 'd'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setCorrect(opt)}
              className={`p-4 rounded-xl border font-semibold transition-all
                ${
                  correct === opt
                    ? 'bg-green-600/30 border-green-500 scale-105'
                    : 'border-white/20 hover:border-green-400'
                }`}
            >
              Option {opt.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            onClick={addQuestion}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold transition"
          >
            {loading ? 'Saving...' : 'Save Question'}
          </button>
        </div>
      </div>
    </div>
  )
}
