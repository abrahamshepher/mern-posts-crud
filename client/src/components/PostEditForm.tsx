import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { usePost, useUpdatePost } from "../hooks/usePosts";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import type { Post, UpdatePostData } from "../lib/api";

export function PostEditForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePost(id!);
  const updatePost = useUpdatePost();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<Post>();

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        content: post.content,
        tags: post.tags,
        status: post.status,
      });
    }
  }, [post, reset]);

  const onSubmit = async (data: UpdatePostData) => {
    try {
      await updatePost.mutateAsync({ ...data, _id: id! });
      toast.success("Post updated successfully!");
      navigate(`/posts/${id}`);
    } catch (error) {
      toast.error("Failed to update post. Please try again.");
      console.error("Failed to update post:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || !post) return <div>Error loading post</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <div>
        <label className="block font-semibold">Title</label>
        <input
          {...register("title", { required: true })}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block font-semibold">Content</label>
        <textarea
          {...register("content", { required: true })}
          className="w-full p-2 border rounded"
          rows={8}
        />
      </div>
      <div>
        <label className="block font-semibold">Tags (comma separated)</label>
        <input
          className="w-full p-2 border rounded"
          defaultValue={post.tags.join(", ")}
          onChange={(e) =>
            setValue(
              "tags",
              e.target.value.split(",").map((t) => t.trim())
            )
          }
        />
      </div>
      <div>
        <label className="block font-semibold">Status</label>
        <select
          {...register("status", { required: true })}
          className="w-full p-2 border rounded"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={isSubmitting}
      >
        Update Post
      </button>
    </form>
  );
}
