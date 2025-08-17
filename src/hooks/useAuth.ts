import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { tokenManager } from "@/lib/axios";
import toast from "react-hot-toast";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Single source of truth for user data
  const {
    data: user,
    isLoading,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Only fetch if we have a token
    enabled: tokenManager.hasToken(),
  });

  // Derived auth state
  const isAuthenticated = !!user && tokenManager.hasToken();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Store access token securely in memory
      tokenManager.setToken(data.access_token);

      // Trigger user data fetch by invalidating query
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      toast.success(data.message);
      navigate("/dashboard"); // We'll create this route next
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/auth/verify-otp");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear local state
      tokenManager.clearToken();
      queryClient.clear(); // Clear all React Query cache
      navigate("/auth/login");
      toast.success("Logged out successfully");
    }
  };

  return {
    // State (single source of truth from React Query)
    user,
    isAuthenticated,
    isLoading,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,

    // Loading states
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
};
