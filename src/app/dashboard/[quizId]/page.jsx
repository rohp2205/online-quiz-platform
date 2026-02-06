'use client'

import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function ManageQuestions() {
  const params = useParams()
  const quizId = params?.quizId
  const router = useRouter()

  const [questions, setQuestions] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    question: '',
    a: '',
    b: '',
    c: '',
    d: '',
    correct: 'a',
  })

  /* ================= FETCH QUESTIONS ================= */
  useEffect(() => {
    if (quizId) {
      fetchQuestions()
    }
  }, [quizId])

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)

    if (error) {
      console.error('Supabase error:', error.message)
      toast.error(error.message)
    } else {
      setQuestions(data || [])
    }
  }

  /* ================= SAVE QUESTION ================= */
  const saveQuestion = async () => {
    if (!form.question || !form.correct) {
      toast.error('Question and correct answer required')
      return
    }

    setLoading(true)
    const toastId = toast.loading(
      editingId ? 'Updating question...' : 'Adding question...'
    )

    const payload = {
      quiz_id: quizId,
      question: form.question,
      option_a: form.a,
      option_b: form.b,
      option_c: form.c,
      option_d: form.d,
      correct_option: form.correct,
    }

    const { error } = editingId
      ? await supabase.from('questions').update(payload).eq('id', editingId)
      : await supabase.from('questions').insert(payload)

    toast.dismiss(toastId)
    setLoading(false)

    if (error) {
      console.error(error)
      toast.error(error.message)
    } else {
      toast.success(editingId ? 'Question updated' : 'Question added')
      resetForm()
      fetchQuestions()
    }
  }

  /* ================= EDIT ================= */
  const editQuestion = (q) => {
    setEditingId(q.id)
    setForm({
      question: q.question,
      a: q.option_a,
      b: q.option_b,
      c: q.option_c,
      d: q.option_d,
      correct: q.correct_option,
    })
  }

  /* ================= DELETE ================= */
  const deleteQuestion = async (id) => {
    if (!confirm('Delete this question?')) return

    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Question deleted')
      fetchQuestions()
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setForm({
      question: '',
      a: '',
      b: '',
      c: '',
      d: '',
      correct: 'a',
    })
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {editingId ? '✏️ Edit Question' : '➕ Add Question'}
          </h1>
          <p className="text-gray-400">
            Manage all questions for this quiz
          </p>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-gray-300 hover:text-white"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* FORM */}
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl mb-10">
        <textarea
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          placeholder="Enter question..."
          rows={3}
          className="w-full mb-6 p-4 rounded bg-black/40 border border-white/20"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {['a', 'b', 'c', 'd'].map((k) => (
            <input
              key={k}
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              placeholder={`Option ${k.toUpperCase()}`}
              className="p-3 rounded bg-black/40 border border-white/20"
            />
          ))}
        </div>

        <div className="flex gap-4 mb-6">
          {['a', 'b', 'c', 'd'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setForm({ ...form, correct: opt })}
              className={`px-4 py-2 rounded border ${
                form.correct === opt
                  ? 'bg-green-600/30 border-green-500'
                  : 'border-white/20'
              }`}
            >
              Correct: {opt.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={saveQuestion}
            disabled={loading}
            className="bg-green-600 px-6 py-2 rounded"
          >
            {editingId ? 'Update Question' : 'Save Question'}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="bg-gray-600 px-6 py-2 rounded"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* QUESTION LIST */}
      <div className="max-w-5xl mx-auto">
        {questions.length === 0 && (
          <p className="text-gray-400 text-center">
            No questions added yet
          </p>
        )}

        {questions.map((q, i) => (
          <div
            key={q.id}
            className="bg-white/10 p-4 rounded mb-4"
          >
            <p className="font-semibold">
              {i + 1}. {q.question}
            </p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => editQuestion(q)}
                className="bg-yellow-500 text-black px-3 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteQuestion(q.id)}
                className="bg-red-600 px-3 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
