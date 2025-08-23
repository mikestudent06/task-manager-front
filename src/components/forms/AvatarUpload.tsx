import React, { useRef, useState } from "react";
import { Camera, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/common/UserAvatar";
import type { User } from "@/types/auth.types";
import toast from "react-hot-toast";

interface AvatarUploadProps {
  user: User;
  onUpload: (file: File) => void;
  onRemove: () => void;
  isUploading?: boolean;
  isRemoving?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  user,
  onUpload,
  onRemove,
  isUploading = false,
  isRemoving = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    onUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar display */}
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="lg" />
          <div className="flex-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Upload area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag & drop an image here, or click to select
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: JPG, PNG, WebP (max 5MB)
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={triggerFileInput}
            disabled={isUploading}
            className="flex-1"
          >
            <Camera className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Change Avatar"}
          </Button>

          {user.avatar && (
            <Button
              variant="outline"
              onClick={onRemove}
              disabled={isRemoving || isUploading}
            >
              <X className="mr-2 h-4 w-4" />
              {isRemoving ? "Removing..." : "Remove"}
            </Button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};
