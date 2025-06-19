import { useState } from "react";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useLikeComment,
  useUpdateComment,
} from "../hooks/useComments";
import { useAuth } from "../contexts/AuthContext";

interface CommentsSectionProps {
  postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const { data, isLoading, error } = useComments(postId, page, 10);
  const createComment = useCreateComment(postId);
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const likeComment = useLikeComment();

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>Error loading comments.</div>;

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await createComment.mutateAsync({ content: comment });
    setComment("");
  };

  const handleEditComment = async (id: string) => {
    if (!editContent.trim()) return;
    await updateComment.mutateAsync({ id, content: editContent });
    setEditingId(null);
    setEditContent("");
  };

  const handleDeleteComment = async (id: string) => {
    if (window.confirm("Delete this comment?")) {
      await deleteComment.mutateAsync({ id, postId });
    }
  };

  const handleLikeComment = async (id: string) => {
    await likeComment.mutateAsync({ id, postId });
  };

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      {user && (
        <form onSubmit={handleAddComment} className="mb-6 flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={createComment.isPending}
          >
            {createComment.isPending ? "Posting..." : "Post"}
          </button>
        </form>
      )}
      <div className="space-y-4">
        {data?.data.length === 0 && <div>No comments yet.</div>}
        {data?.data.map((c) => (
          <div key={c._id} className="border rounded p-3 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{c.author.name}</span>
              <span className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </span>
              {c.isEdited && (
                <span className="text-xs text-yellow-600">(edited)</span>
              )}
            </div>
            {editingId === c._id ? (
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 border rounded px-2 py-1"
                />
                <button
                  onClick={() => handleEditComment(c._id)}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-400 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p className="mb-2">{c.content}</p>
            )}
            <div className="flex gap-4 text-sm text-gray-600">
              <button
                onClick={() => handleLikeComment(c._id)}
                className={"hover:underline flex items-center gap-1"}
                disabled={likeComment.isPending}
              >
                👍 {c.likes.length}
              </button>
              {user && user._id === c.author._id && editingId !== c._id && (
                <>
                  <button
                    onClick={() => {
                      setEditingId(c._id);
                      setEditContent(c.content);
                    }}
                    className="hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="hover:underline text-red-600"
                    disabled={deleteComment.isPending}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {data.pagination.pages}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(data.pagination.pages, p + 1))
            }
            disabled={page === data.pagination.pages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
