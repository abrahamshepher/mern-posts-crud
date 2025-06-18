import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postsApi,
  type CreatePostData,
  type UpdatePostData,
  type Post,
  type Pagination,
  type User,
} from "../lib/api";

export function usePosts(
  page = 1,
  limit = 10,
  search = "",
  category = "",
  tag = "",
  user?: User | null
) {
  return useQuery<{ success: boolean; data: Post[]; pagination: Pagination }>({
    queryKey: ["posts", page, limit, search, category, tag, user?.role],
    queryFn: async () => {
      if (user && (user.role === "admin" || user.role === "author")) {
        const response = await postsApi.getAllAdmin(
          page,
          limit,
          search,
          category,
          tag
        );
        return response.data;
      } else {
        const response = await postsApi.getAll(
          page,
          limit,
          search,
          category,
          tag
        );
        return response.data;
      }
    },
    placeholderData: (prev) => prev,
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const response = await postsApi.getById(id);
      return response.data.data;
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      const response = await postsApi.create(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePostData) => {
      const response = await postsApi.update(data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", data._id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await postsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useSearchPosts(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const response = await postsApi.search(query);
      return response.data.data;
    },
    enabled: query.length > 0,
  });
}

export function usePostsByTag(tag: string) {
  return useQuery({
    queryKey: ["posts", "tag", tag],
    queryFn: async () => {
      const response = await postsApi.getByTag(tag);
      return response.data.data;
    },
  });
}
