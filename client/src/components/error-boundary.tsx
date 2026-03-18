import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import logger from "@/core/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /**
   * Called after a soft reset (state cleared without page reload).
   * Use this to re-fetch data or navigate away when the boundary resets.
   */
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error("ErrorBoundary caught:", error, info.componentStack);
  }

  private isChunkLoadError(): boolean {
    const { error } = this.state;
    if (!error) return false;
    return (
      error.name === "ChunkLoadError" ||
      error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("Importing a module script failed") ||
      error.message.includes("Loading chunk")
    );
  }

  /** Soft reset — clears error state and re-renders children without a page reload. */
  private softReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      if (this.isChunkLoadError()) {
        return (
          <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center">
            <p className="text-5xl mb-4">🔄</p>
            <h2 className="text-xl font-extrabold text-foreground mb-2">New version available</h2>
            <p className="text-sm text-muted-foreground mb-6">
              A page chunk failed to load. This usually means a new deploy is live — reload to get it.
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center">
          <p className="text-5xl mb-4">🚽</p>
          <h2 className="text-xl font-extrabold text-foreground mb-2">Something went sideways.</h2>
          <p className="text-sm text-muted-foreground mb-6">
            The throne room had an unexpected issue. Try refreshing.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={this.softReset}>
              Try Again
            </Button>
            <Button
              onClick={() => {
                this.softReset();
                window.location.reload();
              }}
            >
              Flush &amp; Retry
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
