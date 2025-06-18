import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { EmailVerification } from "./components/EmailVerification";
import { PasswordReset } from "./components/PasswordReset";
import { AuthCheck } from "./components/AuthCheck";
import { UserDashboard } from "./components/UserDashboard";
import { PostList } from "./components/PostList";
import { PostDetail } from "./components/PostDetail";
import { CreatePostForm } from "./components/CreatePostForm";
import { PostEditForm } from "./components/PostEditForm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-teal-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center text-xl font-bold">
              Blog Platform
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Dashboard
                </Link>
                {/* <Link
                  to="/posts/new"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Create Post
                </Link> */}
                <span>Welcome, {user.name}</span>
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<PostList />} />
                <Route path="/posts/:id" element={<PostDetail />} />

                {/* Auth routes - only accessible when NOT logged in */}
                <Route
                  path="/login"
                  element={
                    <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
                      <LoginForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
                      <RegisterForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
                      <PasswordReset />
                    </ProtectedRoute>
                  }
                />

                {/* Protected routes - only accessible when logged in */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/verify-email"
                  element={
                    <ProtectedRoute>
                      <EmailVerification />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/auth-check"
                  element={
                    <ProtectedRoute>
                      <AuthCheck />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts/new"
                  element={
                    <ProtectedRoute>
                      <CreatePostForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts/:id/edit"
                  element={
                    <ProtectedRoute>
                      <PostEditForm />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#4ade80",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
