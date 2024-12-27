'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useTokenStore from '@/lib/store'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const {setToken} = useTokenStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ text: '', type: '' })

    const data = { email, password }

    try {
      setLoading(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`, data)
      setMessage({ text: response.data.msg, type: 'success' })
      setToken( response.data.token,response.data.token,response.data.token,response.data.token)

      if (response.data.user.role === 'admin') {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Login failed. Please try again.'
      setMessage({ text: errorMsg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  from-green-400 via-blue-300 to-green-400">
      <div className="bg-white rounded-lg shadow-md p-6 w-full ">
        <h1 className="text-2xl font-bold text-center mb-4 text-green-600">Welcome Back</h1>
        {message.text && (
          <div
            className={`text-center p-2 rounded mb-4 ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-green-400 focus:ring-green-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-green-400 focus:ring-green-400"
              required
            />
          </div>
          <Button
            type="submit"
            className={`w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-500">
          Dont have an account?
          <a href="/sign-up" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
