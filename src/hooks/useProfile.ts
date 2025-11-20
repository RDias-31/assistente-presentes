'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  name: string
  credits: number
  created_at: string
}

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [userId])

  const updateCredits = async (newCredits: number) => {
    if (!profile) return

    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', profile.id)

    if (!error) {
      setProfile({ ...profile, credits: newCredits })
    }
  }

  return { profile, loading, updateCredits }
}