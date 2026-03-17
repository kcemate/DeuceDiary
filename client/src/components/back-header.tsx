import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

interface BackHeaderProps {
  to: string;
  label: string;
  title?: string;
}

export function BackHeader({ to, label, title }: BackHeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={() => setLocation(to)}
        className={
          "flex items-center gap-1.5 text-sm font-medium text-muted-foreground" +
          " hover:text-foreground transition-colors active:scale-95"
        }
        aria-label={`Back to ${label}`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{label}</span>
      </button>
      {title && (
        <>
          <div className="w-px h-4 bg-border" />
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
        </>
      )}
    </div>
  );
}
