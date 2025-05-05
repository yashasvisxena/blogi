'use client'

import { PostForm } from '@/components/blog/PostForm'
import { Navbar } from '@/components/Navbar'
import { useAuthStore } from '@/store/authStore'
import { redirect } from 'next/navigation'

export default function CreatePostPage() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <PostForm />
        </div>
      </main>
    </div>
  )
} 