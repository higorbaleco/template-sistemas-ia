import React, { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    const newIsDark = !isDark

    if (newIsDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    localStorage.setItem('theme-preference', newIsDark ? 'dark' : 'light')
    setIsDark(newIsDark)
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        btn-secondary inline-flex gap-2 px-3 py-2
        ${className}
      `}
      title="Toggle theme"
      aria-label="Toggle light/dark mode"
    >
      {isDark ? (
        <>
          <Sun size={18} />
          <span className="text-sm">Light</span>
        </>
      ) : (
        <>
          <Moon size={18} />
          <span className="text-sm">Dark</span>
        </>
      )}
    </button>
  )
}
