import { useIsAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

export function AuthCheck() {
  const { data, isLoading, error } = useIsAuth();

  useEffect(() => {
    if (data?.success) {
      toast.success("Authentication verified successfully!");
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error("Authentication check failed. Please log in again.");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Authentication check failed. Please log in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <p>✅ You are authenticated!</p>
        {data?.success && (
          <p className="mt-1 text-sm">Authentication status: Active</p>
        )}
      </div>
    </div>
  );
}
