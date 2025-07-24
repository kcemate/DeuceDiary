import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/useWebSocket";

interface NotificationBannerProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export function NotificationBanner({ message, visible, onClose }: NotificationBannerProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-4 shadow-lg transform transition-transform duration-300 ${
      visible ? "translate-y-0" : "-translate-y-full"
    }`}>
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-7.5-7.5h-5l5-5 5 5h-5a7.5 7.5 0 017.5 7.5v5z" />
          </svg>
          <span className="text-sm font-medium">{message}</span>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="text-primary-foreground hover:text-primary-foreground/80 h-auto p-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
