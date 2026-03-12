import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Shield } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface RequireAuthProps {
  children: ReactNode;
  message?: string;
}

export default function RequireAuth({ children, message }: RequireAuthProps) {
  const { isAuthenticated, isInitializing } = useAuth();
  const { login } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              {message || 'You need to be logged in to access this page.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={login} className="w-full gap-2">
              <LogIn className="w-4 h-4" />
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
