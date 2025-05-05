'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { usePosts } from '@/services/postService'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { postSchema, type PostFormData } from '@/lib/validations/auth'

interface PostFormProps {
  initialData?: {
    id: string
    title: string
    content: string
  }
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter()
  const { useCreatePost, useUpdatePost } = usePosts()
  const { mutate: createPost, isPending: isCreating } = useCreatePost()
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost()

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
    },
  })

  const onSubmit = (data: PostFormData) => {
    if (initialData) {
      updatePost(
        { id: initialData.id, postData: data },
        {
          onSuccess: () => {
            router.push('/')
          },
        }
      )
    } else {
      createPost(
        { ...data, authorId: '' }, // This will be set by the backend
        {
          onSuccess: () => {
            router.push('/')
          },
        }
      )
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Post' : 'Create Post'}</CardTitle>
        <CardDescription>
          {initialData ? 'Update your blog post' : 'Write a new blog post'}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your post content"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? initialData
                  ? 'Updating...'
                  : 'Creating...'
                : initialData
                ? 'Update Post'
                : 'Create Post'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
} 