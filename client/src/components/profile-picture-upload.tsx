import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera } from "lucide-react";
import { getAuthToken } from "@/lib/auth-token";
import { useMutationWithToast } from "@/hooks/useMutationWithToast";

interface ProfilePictureUploadProps {
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    profileImageUrl?: string;
  };
  size?: "sm" | "md" | "lg";
  showUploadButton?: boolean;
}

export function ProfilePictureUpload({ 
  user, 
  size = "md",
  showUploadButton = true 
}: ProfilePictureUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-24 w-24"
  };

  const uploadMutation = useMutationWithToast({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('profilePicture', file);

      // For FormData, we need to use fetch directly since apiRequest expects JSON
      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch("/api/auth/user/profile-picture", {
        method: "POST",
        body: formData,
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${response.status}: ${error}`);
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Profile picture updated successfully!",
      });
    },
    errorMessage: "Failed to upload profile picture. Please try again.",
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (user: ProfilePictureUploadProps["user"]) => {
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="relative flex items-center space-x-4">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={user.profileImageUrl || undefined} alt="Profile" />
          <AvatarFallback>{getInitials(user)}</AvatarFallback>
        </Avatar>
        
        {showUploadButton && (
          <Button
            variant="outline"
            size="sm"
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
            onClick={handleUploadClick}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
            ) : (
              <Camera className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {showUploadButton && size === "lg" && (
        <Button
          variant="outline"
          onClick={handleUploadClick}
          disabled={uploadMutation.isPending}
          className="flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>{uploadMutation.isPending ? "Uploading..." : "Upload Photo"}</span>
        </Button>
      )}
    </div>
  );
}