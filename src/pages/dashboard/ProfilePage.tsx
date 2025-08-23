import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { AvatarUpload } from "@/components/forms/AvatarUpload";
import { PasswordForm } from "@/components/forms/PasswordForm";
import { UserStats } from "@/components/common/UserStats";
import type { UpdateProfileData, ChangePasswordData } from "@/types/user.types";

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const {
    userStats,
    isStatsLoading,
    updateProfile,
    changePassword,
    uploadAvatar,
    removeAvatar,
    isUpdatingProfile,
    isChangingPassword,
    isUploadingAvatar,
    isRemovingAvatar,
  } = useUserProfile();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = (data: UpdateProfileData) => {
    updateProfile(data);
  };

  const handlePasswordChange = (data: ChangePasswordData) => {
    changePassword(data);
  };

  const handleAvatarUpload = (file: File) => {
    uploadAvatar(file);
  };

  const handleAvatarRemove = () => {
    removeAvatar();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Profile forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Avatar upload */}
          <AvatarUpload
            user={user}
            onUpload={handleAvatarUpload}
            onRemove={handleAvatarRemove}
            isUploading={isUploadingAvatar}
            isRemoving={isRemovingAvatar}
          />

          {/* Profile form */}
          <ProfileForm
            user={user}
            onSubmit={handleProfileUpdate}
            isLoading={isUpdatingProfile}
          />

          {/* Password form */}
          <PasswordForm
            onSubmit={handlePasswordChange}
            isLoading={isChangingPassword}
          />
        </div>

        {/* Right column - User stats */}
        <div className="space-y-6">
          <UserStats stats={userStats!} isLoading={isStatsLoading} />
        </div>
      </div>
    </div>
  );
};
