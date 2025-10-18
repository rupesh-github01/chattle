'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // First, set mounted to true to enable client-side rendering
    setMounted(true)
    
    // Then initialize the theme
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Determine initial dark mode state
    const initialDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
    
    // Update state and DOM
    setIsDark(initialDark)
    if (initialDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Debug log
    console.log('Theme initialized:', {
      savedTheme,
      systemPrefersDark,
      initialDark,
      classList: document.documentElement.classList.contains('dark')
    })
  }, [])

  const toggleTheme = () => {
    console.log('Toggle clicked, current isDark:', isDark)
    
    // Toggle the theme
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    // Update DOM and localStorage
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    console.log('After toggle:', {
      newIsDark,
      classList: document.documentElement.classList.contains('dark'),
      localStorage: localStorage.getItem('theme')
    })
  }

  // Only render after mounting to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}