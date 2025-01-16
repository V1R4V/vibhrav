'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function Nav() {
  const [opacity, setOpacity] = useState(1)

  // Set up scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Adjust opacity based on scroll position
      setOpacity(scrollY > 50 ? 0 : 1) // Change 50 to your desired scroll threshold
    }

    // Add event listener on mount
    window.addEventListener('scroll', handleScroll)

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Handle reload on link click
  const handleReload = (e: React.MouseEvent) => {
    e.preventDefault()  // Prevent default link behavior
    window.location.reload()  // Reload the page
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold" style={{ opacity }}>
          VIBHRAV JHA
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            HOME
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors">
            ABOUT
          </Link>
        </div>
      </div>
    </nav>
  )
}
