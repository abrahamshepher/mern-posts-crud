import axios from "axios";

// export const API_URL = "http://localhost:4000/api";
const API_URL = import.meta.env.VITE_APP_API_URL;
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Pagination interface
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "author";
  bio: string;
  avatar?: string;
  isAccountVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User;
  tags: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: "user" | "author" | "admin";
}

export interface VerifyAccountData {
  otp: string;
}

export interface SendResetOtpData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  tags: string[];
}

export interface UpdatePostData extends Partial<CreatePostData> {
  _id: string;
}

export interface Comment {
  _id: string;
  content: string;
  post: string;
  author: User;
  parentComment?: string;
  likes: string[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// API endpoints
export const authApi = {
  login: (credentials: LoginCredentials) =>
    api
      .post<{ success: boolean; token: string; user: User }>(
        "/auth/login",
        credentials
      )
      .then((res) => res.data),
  register: (credentials: RegisterCredentials) =>
    api
      .post<{ success: boolean; token: string; user: User }>(
        "/auth/register",
        credentials
      )
      .then((res) => res.data),
  me: () =>
    api
      .get<{ success: boolean; data: User }>("/users/me")
      .then((res) => res.data.data),
  sendVerifyOtp: () =>
    api
      .post<{ success: boolean; message: string }>("/auth/send-verify-otp")
      .then((res) => res.data),
  verifyAccount: (data: VerifyAccountData) =>
    api
      .post<{ success: boolean; message: string }>("/auth/verify-account", data)
      .then((res) => res.data),
  isAuth: () =>
    api
      .get<{ success: boolean; user: User }>("/auth/is-auth")
      .then((res) => res.data),
  sendResetOtp: (data: SendResetOtpData) =>
    api
      .post<{ success: boolean; message: string }>("/auth/send-reset-otp", data)
      .then((res) => res.data),
  resetPassword: (data: ResetPasswordData) =>
    api
      .post<{ success: boolean; message: string }>("/auth/reset-password", data)
      .then((res) => res.data),
};

export const postsApi = {
  getAll: (page = 1, limit = 10, search = "", category = "", tag = "") =>
    api.get<{ success: boolean; data: Post[]; pagination: Pagination }>(
      `/posts?page=${page}&limit=${limit}&search=${search}&category=${category}&tag=${tag}`
    ),
  getAllAdmin: (page = 1, limit = 10, search = "", category = "", tag = "") =>
    api.get<{ success: boolean; data: Post[]; pagination: Pagination }>(
      `/posts/all?page=${page}&limit=${limit}&search=${search}&category=${category}&tag=${tag}`
    ),
  getById: (id: string) =>
    api.get<{ success: boolean; data: Post }>(`/posts/${id}`),
  create: (data: CreatePostData) =>
    api.post<{ success: boolean; data: Post }>("/posts", data),
  update: (data: UpdatePostData) =>
    api.put<{ success: boolean; data: Post }>(`/posts/${data._id}`, data),
  delete: (id: string) =>
    api.delete<{ success: boolean; data: object }>(`/posts/${id}`),
  search: (query: string) =>
    api.get<{ success: boolean; data: Post[] }>(
      `/posts/search?q=${encodeURIComponent(query)}`
    ),
  getByTag: (tag: string) =>
    api.get<{ success: boolean; data: Post[] }>(
      `/posts/tag/${encodeURIComponent(tag)}`
    ),
};

export const commentsApi = {
  getForPost: (postId: string, page = 1, limit = 10) =>
    api.get<{
      success: boolean;
      data: Comment[];
      pagination: CommentPagination;
    }>(`/posts/${postId}/comments?page=${page}&limit=${limit}`),
  create: (postId: string, data: { content: string; parentComment?: string }) =>
    api.post<{ success: boolean; data: Comment }>(
      `/posts/${postId}/comments`,
      data
    ),
  update: (id: string, data: { content: string }) =>
    api.put<{ success: boolean; data: Comment }>(`/comments/${id}`, data),
  delete: (id: string) =>
    api.delete<{ success: boolean; data: object }>(`/comments/${id}`),
  like: (id: string) =>
    api.put<{ success: boolean; data: Comment }>(`/comments/${id}/like`),
};
