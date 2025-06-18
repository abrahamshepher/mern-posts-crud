import { useParams, useNavigate } from "react-router-dom";
import { usePost, useDeletePost } from "../hooks/usePosts";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { CommentsSection } from "./CommentsSection";

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: post, isLoading, error } = usePost(id!);

  console.log("post", post?.author?.name);

  const deletePost = useDeletePost();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading post: {error.message}</div>;
  if (!post) return <div>Post not found</div>;

  const isAuthor = user?._id === post.author?._id;
  const isAdmin = user?.role === "admin";

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost.mutateAsync(post?._id || "");
        toast.success("Post deleted successfully!");
        navigate("/");
      } catch (error) {
        toast.error("Failed to delete post. Please try again.");
        console.error("Failed to delete post:", error);
      }
    }
  };

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between text-gray-600">
          <div>
            <h1 className="text-3xl  font-bold mb-2">{post?.title}</h1>
            <span>By {post?.author?.name || "Unknown Author"}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post?.createdAt || "").toLocaleDateString()}</span>
          </div>
          {(isAuthor || isAdmin) && (
            <div className="space-x-4">
              <button
                onClick={() => navigate(`/posts/${post?._id}/edit`)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="prose max-w-none">
        <p className="whitespace-pre-wrap">{post?.content}</p>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <CommentsSection postId={post._id} />
      </div>

      <div className="mt-8 flex gap-2">
        {post?.tags?.map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
