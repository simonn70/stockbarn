'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const router = useRouter() // Initialize router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ text: '', type: '' })

    const data = {
      email,
      password,
    }

    try {
      setLoading(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`, data)
      setMessage({ text: response.data.msg, type: 'success' })
      console.log('Login successful:', response.data)

      // Store the token in localStorage (or cookies)
      localStorage.setItem('token', response.data.token)
      console.log(response.data.user.role)

      if (response.data.user.role === 'admin'){
        router.push('/dashboard')
      }
      else {
        router.push('/')
      }

    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || 'Login failed. Please try again.'
      setMessage({ text: errorMsg, type: 'error' })
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message.text && (
        <div
          className={`text-center p-2 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Log in'}
      </Button>
    </form>
  )
}
