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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showOnlyMyPosts, setShowOnlyMyPosts] = useState(false);
  const { useGetPosts } = usePosts();
  const { user } = useAuthStore();
  const { data, isLoading } = useGetPosts({
    page,
    limit: 10,
    search,
    sortBy,
    sortOrder,
    userId: showOnlyMyPosts ? user?.id : undefined,
  });

  const sortedPosts = data?.posts ? [...data.posts] : [];
  if (sortBy === "title") {
    sortedPosts.sort((a, b) => {
      const comparison = a.title
        .toLowerCase()
        .localeCompare(b.title.toLowerCase());
      return sortOrder === "desc" ? -comparison : comparison;
    });
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const totalPages = Math.ceil((data?.total || 0) / 10);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Fixed Header */}
      <div className="flex-none p-4 border-b">
        <form onSubmit={handleSearch} className="flex gap-4">
          <Input
            type="search"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <Button type="submit">Search</Button>
          <div className="flex items-center gap-2">
            <span>Sort By:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created At</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author.username">Author</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span>Asc</span>
            <Switch
              checked={sortOrder === "desc"}
              onCheckedChange={(checked) =>
                setSortOrder(checked ? "desc" : "asc")
              }
            />
            <span>Desc</span>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <span>My Posts</span>
              <Switch
                checked={showOnlyMyPosts}
                onCheckedChange={setShowOnlyMyPosts}
              />
            </div>
          )}
        </form>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : data?.posts.length === 0 ? (
          <div className="text-center h-full flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">No posts found</h1>
            <p className="text-gray-500">Create a post to get started</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(sortBy === "title" ? sortedPosts : data?.posts)?.map(
              (post: any) => (
                <PostCard key={post.id} post={post} />
              )
            )}
          </div>
        )}
      </div>

      {/* Fixed Footer */}
      {data?.posts && data.posts.length > 0 && (
        <div className="flex-none p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
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
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
