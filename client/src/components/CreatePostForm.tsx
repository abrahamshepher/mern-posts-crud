import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostFormData } from "../lib/schemas";
import { useCreatePost } from "../hooks/usePosts";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function CreatePostForm() {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      status: "draft",
    },
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      await createPost.mutateAsync(data);
      toast.success("Post created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            {...register("title")}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium">
            Content
          </label>
          <textarea
            {...register("content")}
            rows={10}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <input
            {...register("category")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium">
            Tags (comma-separated)
          </label>
          <input
            {...register("tags", {
              setValueAs: (value: string) =>
                value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag !== ""),
            })}
            type="text"
            placeholder="e.g., technology, programming, web"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
          )}
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

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
