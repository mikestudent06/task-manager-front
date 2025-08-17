import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types/auth.types";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16",
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "md",
  className = "",
}) => {
  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={user.avatar || undefined} alt={user.name} />
      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
};
