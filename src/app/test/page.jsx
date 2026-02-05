'use client'
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'

export default function Test() {
  useEffect(() => {
    supabase.from('quizzes').select('*').then(res => {
      console.log('Supabase connected:', res)
    })
  }, [])

  return <h1>Supabase Test</h1>
}
