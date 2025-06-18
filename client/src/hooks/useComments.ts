import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi, type Comment } from "../lib/api";

export function useComments(postId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ["comments", postId, page, limit],
    queryFn: async () => {
      const response = await commentsApi.getForPost(postId, page, limit);
      return response.data;
    },
    enabled: !!postId,
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { content: string; parentComment?: string }) => {
      const response = await commentsApi.create(postId, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const response = await commentsApi.update(id, { content });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.post] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, postId }: { id: string; postId: string }) => {
      await commentsApi.delete(id);
      return { id, postId };
    },
    onSuccess: ({ postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}

export function useLikeComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, postId }: { id: string; postId: string }) => {
      const response = await commentsApi.like(id);
      return { ...response.data.data, post: postId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.post] });
    },
  });
}
