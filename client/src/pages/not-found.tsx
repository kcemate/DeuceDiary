import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function NotFound() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    if (isAuthenticated) {
      setLocation("/");
    } else {
      window.location.href = "/api/login";
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {isLoading 
              ? "Loading..." 
              : isAuthenticated 
                ? "The page you're looking for doesn't exist."
                : "You may need to log in to access this page."
            }
          </p>
          <Button onClick={handleGoHome} className="w-full">
            <Home className="h-4 w-4 mr-2" />
            {isAuthenticated ? "Go Home" : "Log In"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
