'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import Post from '@/components/Post'
import CommentSection from '@/components/CommentSection'
import Cookies from 'js-cookie'

export default function Home(){
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
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

  // Smooth text reveal animation
  useEffect(() => {
    if (!user?.name) return;
    
    const fullText = `Hello, ${user.name}`;
    setDisplayedText('');
    
    let currentIndex = 0;
    const intervalDuration = 50; // Smooth flowing speed
    
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, intervalDuration);
    
    return () => clearInterval(interval);
  }, [user?.name]);


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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-white/20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center relative z-10">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            .Chattle
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200/30 shadow-sm">
              Hello, <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="
                group relative flex items-center justify-center
                w-10 h-10
                bg-gradient-to-r from-red-500 to-pink-600
                text-white
                rounded-full
                overflow-hidden
                transition-all duration-500 ease-in-out
                hover:w-28
                shadow-lg shadow-red-500/30
                hover:shadow-xl hover:shadow-red-500/40
              "
            >
              {/* Cross icon */}
              <span
                className="
                  absolute
                  text-lg
                  transition-all duration-300 ease-in-out
                  group-hover:opacity-0
                  group-hover:translate-x-[-10px]
                "
              >
                ✖
              </span>

              {/* Logout text */}
              <span
                className="
                  opacity-0
                  text-sm font-medium
                  transition-all duration-300 ease-in-out
                  group-hover:opacity-100
                  group-hover:translate-y-0
                  translate-y-2
                "
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* Premium Welcome Section */}
        <div className="mb-12 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl group-hover:blur-2xl transition-all duration-700"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 p-8 md:p-12 border border-white/50 hover:border-purple-300/50 transition-all duration-500">
            <div className="flex items-center justify-center mb-4">
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-sm shadow-purple-500/30"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight pb-2">
              {displayedText}
              <span className="inline-block w-0.5 h-10 md:h-12 bg-gradient-to-b from-purple-600 to-pink-600 ml-1 animate-pulse"></span>
            </h2>
            <p className="text-center text-gray-600 mt-4 text-lg font-light">
              We're thrilled to have you here
            </p>
            <div className="flex items-center justify-center mt-6">
              <div className="h-1 w-20 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full shadow-sm shadow-pink-500/30"></div>
            </div>
          </div>
        </div>

        {/* Post Section with gradient wrapper */}
        <div className="mb-8 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-500/10 border border-white/50 overflow-hidden">
            <Post />
          </div>
        </div>

        {/* Comment Section with gradient wrapper */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-pink-500/10 border border-white/50 overflow-hidden">
            <CommentSection user={user} />
          </div>
        </div>
      </div>
    </main>
  )

}