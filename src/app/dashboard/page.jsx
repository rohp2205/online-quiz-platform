'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [quizzes, setQuizzes] = useState([])
  const [questionCounts, setQuestionCounts] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else {
        setUser(data.user)
        fetchData()
      }
    })
  }, [])

  const fetchData = async () => {
    const { data: quizzes } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: questions } = await supabase
      .from('questions')
      .select('quiz_id')

    const counts = {}
    questions?.forEach((q) => {
      counts[q.quiz_id] = (counts[q.quiz_id] || 0) + 1
    })

    setQuizzes(quizzes || [])
    setQuestionCounts(counts)
  }

  const createQuiz = async () => {
    if (!title) return toast.error('Quiz title required')

    const loading = toast.loading('Creating quiz...')
    const { error } = await supabase.from('quizzes').insert({ title })
    toast.dismiss(loading)

    if (error) toast.error('Failed to create quiz')
    else {
      toast.success('Quiz created')
      setTitle('')
      fetchData()
    }
  }

  const saveEdit = async () => {
    const loading = toast.loading('Updating quiz...')
    const { error } = await supabase
      .from('quizzes')
      .update({ title: editingTitle })
      .eq('id', editingId)

    toast.dismiss(loading)

    if (error) toast.error('Update failed')
    else {
      toast.success('Quiz updated')
      setEditingId(null)
      setEditingTitle('')
      fetchData()
    }
  }

  const deleteQuiz = async (id) => {
    if (!confirm('Delete quiz and all questions?')) return

    const loading = toast.loading('Deleting quiz...')
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id)

    toast.dismiss(loading)

    if (error) toast.error('Delete failed')
    else {
      toast.success('Quiz deleted')
      fetchData()
    }
  }

  /* 🔗 COPY QUIZ LINK */
  const copyQuizLink = (quizId) => {
    const link = `${window.location.origin}/quiz/${quizId}`
    navigator.clipboard.writeText(link)
    toast.success('Quiz link copied')
  }

  const logout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out')
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/10 p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-10">QuizAdmin</h2>
        <nav className="space-y-4">
          <SidebarItem label="Dashboard" active />
          <SidebarItem
            label="Analytics"
            onClick={() => router.push('/dashboard/analytics')}
          />
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1">

        {/* TOP BAR */}
        <div className="flex justify-between items-center px-8 py-4 border-b border-white/10">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold uppercase">
              {user.email.charAt(0)}
            </div>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8 max-w-6xl mx-auto">

          {/* CREATE QUIZ */}
          <div className="bg-white/10 backdrop-blur border border-white/10 rounded-xl p-6 mb-10">
            <h2 className="text-lg font-semibold mb-4">Create Quiz</h2>

            <div className="flex gap-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Quiz title"
                className="flex-1 bg-black/40 border border-white/20 p-3 rounded"
              />
              <button
                onClick={createQuiz}
                className="bg-blue-600 hover:bg-blue-700 px-6 rounded font-semibold"
              >
                Create
              </button>
            </div>
          </div>

          {/* QUIZ LIST */}
          <h2 className="text-2xl font-bold mb-4">Your Quizzes</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="bg-white/10 backdrop-blur border border-white/10 rounded-xl p-6"
              >
                {editingId === q.id ? (
                  <>
                    <input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="w-full bg-black/40 p-3 rounded mb-3"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 px-4 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-600 px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">{q.title}</h3>

                    <p className="text-sm text-gray-400">
                      {questionCounts[q.id] || 0} Questions
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      {/* LEFT ACTIONS */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => router.push(`/dashboard/${q.id}`)}
                          className="text-blue-400 hover:underline"
                        >
                          Add Questions →
                        </button>

                        {/* 🔗 ICON AVATAR COPY LINK */}
                        <button
                          onClick={() => copyQuizLink(q.id)}
                          title="Copy quiz link"
                          className="w-9 h-9 rounded-full 
                                     bg-gradient-to-br from-purple-600 to-blue-600 
                                     flex items-center justify-center 
                                     hover:scale-110 transition"
                        >
                          🔗
                        </button>
                      </div>

                      {/* RIGHT ACTIONS */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(q.id)
                            setEditingTitle(q.title)
                          }}
                          className="bg-yellow-500 text-black px-3 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteQuiz(q.id)}
                          className="bg-red-600 px-3 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

/* SIDEBAR ITEM */
function SidebarItem({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 rounded cursor-pointer transition ${
        active ? 'bg-purple-600/30 text-purple-300' : 'hover:bg-white/10'
      }`}
    >
      {label}
    </div>
  )
}
