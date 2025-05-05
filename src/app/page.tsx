"use client"

import { useState } from 'react'
import { usePosts } from '@/services/postService'
import { PostCard } from '@/components/blog/PostCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/Navbar'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function Home() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { useGetPosts } = usePosts()
  const { data, isLoading } = useGetPosts({
    page,
    limit: 10,
    search,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  const totalPages = Math.ceil((data?.total || 0) / 10)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              type="search"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data?.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault()
                        if (page > 1) setPage(page - 1)
                      }}
                      className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setPage(pageNum)
                        }}
                        isActive={pageNum === page}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (page < totalPages) setPage(page + 1)
                      }}
                      className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
