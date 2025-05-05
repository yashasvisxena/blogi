'use client'

import { PostForm } from '@/components/blog/PostForm'
import { Navbar } from '@/components/Navbar'


export default function CreatePostPage() {

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