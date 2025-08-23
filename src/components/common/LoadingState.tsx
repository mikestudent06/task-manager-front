import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  size = "md",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-primary mb-2`}
      />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

// Full page loading component
export const PageLoading: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingState message={message} size="lg" />
    </div>
  );
};
