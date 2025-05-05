'use client'

import { RegisterForm } from '@/components/auth/RegisterForm'
import { Navbar } from '@/components/Navbar'

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <RegisterForm />
        </div>
      </main>
    </div>
  )
} 