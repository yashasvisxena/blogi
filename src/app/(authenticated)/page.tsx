"use client";

import { useEffect, useState } from "react";
import { usePosts } from "@/services/postService";
import { PostCard } from "@/components/blog/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Home() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { useGetPosts } = usePosts();
  const { data, isLoading } = useGetPosts({
    page,
    limit: 10,
    search,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  if (data?.posts.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">No posts found</h1>
        <p className="text-gray-500">Create a post to get started</p>
      </div>
    );
  }
  const totalPages = Math.ceil((data?.total || 0) / 10);

  return (
    <div className="flex flex-col min-h-0 flex-grow flex-1">
      <main className="container mx-auto p-4 flex flex-col flex-grow">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <Input
            type="search"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <Button type="submit">Search</Button>
        </form>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="flex flex-col flex-grow flex-1 min-h-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto flex-grow">
              {data?.posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {data?.posts && data.posts.length > 0 && (
              <div className="mt-6 py-4 border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage(page - 1);
                        }}
                        className={
                          page === 1 ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(pageNum);
                            }}
                            isActive={pageNum === page}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < totalPages) setPage(page + 1);
                        }}
                        className={
                          page === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
