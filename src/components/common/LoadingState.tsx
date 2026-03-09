import React from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LoadingStateProps {
  message?: string;
  /** i18n key (e.g. common.loadingApp). Used when message is not provided. */
  messageKey?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  messageKey,
  size = "md",
}) => {
  const { t } = useTranslation();
  const displayMessage = message ?? (messageKey ? t(messageKey) : t("common.loading"));
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-primary mb-2`}
      />
      <p className="text-sm text-muted-foreground">{displayMessage}</p>
    </div>
  );
};

// Full page loading component
export const PageLoading: React.FC<{
  message?: string;
  messageKey?: string;
}> = ({ message, messageKey }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingState message={message} messageKey={messageKey} size="lg" />
    </div>
  );
};
