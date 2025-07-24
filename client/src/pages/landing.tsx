import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Welcome */}
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 2V1h6v1c2.21 0 4 1.79 4 4v2c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1V6c0-2.21 1.79-4 4-4zm0 2c-1.1 0-2 .9-2 2v1h10V6c0-1.1-.9-2-2-2H9zm-3 8v9c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-9H6zm2 2h2v5H8v-5zm6 0h2v5h-2v-5z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Deuce Diary</h1>
          <p className="text-muted-foreground text-center">
            Share your best thoughts from the throne with your dudes.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Create Groups</h3>
                  <p className="text-sm text-muted-foreground">Form groups to share your throne thoughts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Log Your Deuces</h3>
                  <p className="text-sm text-muted-foreground">Track thoughts, locations, and more</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-7.5-7.5h-5l5-5 5 5h-5a7.5 7.5 0 017.5 7.5v5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Real-time Updates</h3>
                  <p className="text-sm text-muted-foreground">Get notified when your dudes log entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login Button */}
        <div className="text-center">
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
