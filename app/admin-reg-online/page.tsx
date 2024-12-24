'use client'

import LoginForm from '@/components/SignIn'
import SignupAdminForm from '@/components/SignUpAdmin'
import { useState } from 'react'


export default function Home() {
  const [isLogin, setIsLogin] = useState(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">
          {isLogin ? 'Login' : 'Sign Up Admin'}
        </h1>
        {isLogin ? <LoginForm/> : <SignupAdminForm />}
        <p className="text-center mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </main>
  )
}

