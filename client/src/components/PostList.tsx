import { useState, useMemo, useEffect } from "react";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { usePosts } from "../hooks/usePosts";
import { useAuth } from "../contexts/AuthContext";
import type { Post } from "../lib/api";

export function PostList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce the search input
  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => setDebouncedSearch(val), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
    debouncedSetSearch(e.target.value);
  };

  const { user } = useAuth();

  // Move hooks before any conditional returns
  const { data, isLoading, error } = usePosts(
    page,
    10,
    debouncedSearch,
    "",
    "",
    user
  );

  useEffect(() => {
    if (error) {
      toast.error("Failed to load posts. Please try again.");
    }
  }, [error]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;
  if (!data) return <div>No posts found</div>;

  // Safely get user role with fallback
  const userRole = user?.role || "user";
  const isAdmin = userRole === "admin";
  const isAuthor = userRole === "author";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          Search Blog Posts
          {isLoading && <span className="ml-2 animate-spin">🔄</span>}
        </h2>
        {(isAdmin || isAuthor) && (
          <Link
            to="/posts/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Post
          </Link>
        )}
      </div>

      <input
        type="text"
        placeholder="Search by title, category, or tag"
        value={search}
        onChange={handleSearchChange}
        className="mb-4 p-2 border rounded w-full"
      />

      <div className="space-y-4">
        {data.data.map((post: Post) => (
          <article
            key={post._id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold">
              <Link to={`/posts/${post._id}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h3>
            <p className="text-gray-600 mt-2">
              By {post.author.name} on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-2 flex gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
        {!isLoading && data.data.length === 0 && (
          <div className="text-center text-gray-500">No posts found.</div>
        )}
      </div>

      {data.pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {data.pagination.pages}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(data.pagination.pages, p + 1))
            }
            disabled={page === data.pagination.pages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
