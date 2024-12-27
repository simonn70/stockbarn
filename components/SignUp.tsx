'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // To display messages (success/error)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' }); // Clear previous messages

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords don't match.", type: 'error' });
      return;
    }

    const data = {
      role: "customer",
      name,
      email,
      phone,
      password,
      repeatPassword: confirmPassword,
    };

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`, data);
      setMessage({ text: response.data.msg, type: 'success' }); // Display success message
      if (response) {
        router.push('/sign-in');
      }
      console.log(response.data);
    } catch (error) {
      // Extract message from backend or use a default fallback
      const errorMsg = error.response?.data?.msg || 'Signup failed. Please try again.';
      setMessage({ text: errorMsg, type: 'error' });
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  from-green-400 via-blue-300 to-green-400">
      <div className="bg-white rounded-lg shadow-md p-6 w-full ">
        <h1 className="text-2xl font-bold text-center mb-4 text-green-600">Create Your Account</h1>

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
            <Label htmlFor="name" className="text-sm text-gray-700">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-green-400 focus:ring-green-400"
              required
            />
          </div>
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
            <Label htmlFor="phone" className="text-sm text-gray-700">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0222222222"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-green-400 focus:ring-green-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-green-400 focus:ring-green-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm text-gray-700">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-green-400 focus:ring-green-400"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/sign-in" className="text-blue-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
