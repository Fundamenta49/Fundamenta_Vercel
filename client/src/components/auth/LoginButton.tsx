import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';

interface LoginButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function LoginButton({ 
  variant = 'default', 
  size = 'default',
  showIcon = true,
  className = ''
}: LoginButtonProps) {
  const { user, isAuthenticated } = useAuth();

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  if (isAuthenticated) {
    return (
      <Button 
        variant={variant} 
        size={size}
        onClick={handleLogout}
        className={className}
      >
        {showIcon && <LogOut className="mr-2 h-4 w-4" />}
        Logout
      </Button>
    );
  }

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleLogin}
      className={className}
    >
      {showIcon && <LogIn className="mr-2 h-4 w-4" />}
      Login
    </Button>
  );
}