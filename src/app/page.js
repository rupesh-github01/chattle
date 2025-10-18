'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import Post from '@/components/Post'
import CommentSection from '@/components/CommentSection'
import ThemeToggle from '@/components/ThemeToggle'
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
    
    const fullText = `Welcome, ${user.name}`;
    setDisplayedText('');
    
    let currentIndex = 0;
    const intervalDuration = 50;
    
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-pink-950/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-pink-950/30 relative overflow-hidden transition-colors duration-500">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg top-0 z-50 border-b border-white/20 dark:border-slate-700/50 relative transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10"></div>
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center relative z-10">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            .Chattle
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-purple-200/30 dark:border-purple-700/30 shadow-sm">
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Catch Up!</span>
            </span>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            <button
              onClick={handleLogout}
              className="
                group relative flex items-center justify-center
                w-10 h-10
                bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-600 dark:to-pink-700
                text-white
                rounded-full
                overflow-hidden
                transition-all duration-500 ease-in-out
                hover:w-28
                shadow-lg shadow-red-500/30 dark:shadow-red-600/30
                hover:shadow-xl hover:shadow-red-500/40 dark:hover:shadow-red-600/40
              "
            >
              <span className="absolute text-lg transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:translate-x-[-10px]">
                ✖
              </span>
              <span className="opacity-0 text-sm font-medium transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10 blur-3xl group-hover:blur-2xl transition-all duration-700"></div>
          <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 dark:shadow-purple-900/20 p-8 md:p-12 border border-white/50 dark:border-slate-700/50 hover:border-purple-300/50 dark:hover:border-purple-600/50 transition-all duration-500">
            <div className="flex items-center justify-center mb-4">
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 rounded-full shadow-sm shadow-purple-500/30"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight pb-2">
              {displayedText}
              <span className="inline-block w-0.5 h-10 md:h-12 bg-gradient-to-b from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 ml-1 animate-pulse"></span>
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4 text-lg font-light">
              We're thrilled to have you here
            </p>
            <div className="flex items-center justify-center mt-6">
              <div className="h-1 w-20 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 rounded-full shadow-sm shadow-pink-500/30"></div>
            </div>
          </div>
        </div>

        {/* Post Section with gradient wrapper */}
        <div className="mb-8 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
          <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-500/10 dark:shadow-blue-900/20 border border-white/50 dark:border-slate-700/50 overflow-hidden">
            <Post />
          </div>
        </div>

        {/* Comment Section with gradient wrapper */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-pink-600 dark:via-purple-600 dark:to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
          <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-pink-500/10 dark:shadow-pink-900/20 border border-white/50 dark:border-slate-700/50 overflow-hidden">
            <CommentSection user={user} />
          </div>
        </div>
      </div>
    </main>
  )

}