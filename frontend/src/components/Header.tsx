'use client'

import Link from 'next/link'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Header() {
  const handleLogout = () => {
    logout()
  }
  const { isAuthenticated, logout } = useContext(AuthContext)

  return (
    <header className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">Vagas.com</Link>
        </div>
        <nav className="space-x-4">
          <Link href="/jobs" className="hover:text-gray-300">
            Vagas
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="hover:text-gray-300 cursor-pointer focus:outline-none"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="hover:text-gray-300">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
