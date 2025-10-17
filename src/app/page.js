'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import Post from '@/components/Post'
import CommentSection from '@/components/CommentSection'
import Cookies from 'js-cookie'

export default function Home(){
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const router = useRouter();

  useEffect(()=>{
    const checkAuth = async ()=>{
      const token = Cookies.get('token')

      if(!token){
        router.push('/login');
        return;
      }

      try{
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization' : `Bearer ${token}`
          }
        })
        if(response.ok){
          const data = await response.json()
          setUser(data.user)
        }
        else{
          Cookies.remove('token')
          router.push('/login')
        }
      }
      catch(error){
        console.error('Auth check failed: ',error)
        router.push('/login')
      }
      finally{
        setLoading(false)
      }

    }
    checkAuth()
  },[router])


  const handleLogout = ()=>{
    Cookies.remove('token')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">CommentHub</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Post />
        <CommentSection user={user} />
      </div>
    </main>
  )

}
