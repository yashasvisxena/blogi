'use client'

import { PostForm } from '@/components/blog/PostForm'
import { Navbar } from '@/components/Navbar'
import { useAuthStore } from '@/store/authStore'
import { usePosts } from '@/services/postService'
import { redirect } from 'next/navigation'

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { isAuthenticated, user } = useAuthStore()
  const { useGetPost } = usePosts()
  const { data: post, isLoading } = useGetPost(params.id)

  if (!isAuthenticated) {
    redirect('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  if (!post || post.author.id !== user?.id) {
    redirect('/')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <PostForm initialData={post} />
        </div>
      </main>
    </div>
  )
} 