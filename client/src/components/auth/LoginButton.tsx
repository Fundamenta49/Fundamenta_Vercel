import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

export function LoginButton() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  const handleLogin = () => {
    window.location.href = '/api/login';
  };
  
  const handleLogout = () => {
    window.location.href = '/api/logout';
  };
  
  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <User className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }
  
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        {user?.profileImageUrl && (
          <img 
            src={user.profileImageUrl} 
            alt="Profile" 
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div className="flex flex-col text-sm">
          <span className="font-medium">{user?.name || user?.firstName || "User"}</span>
          {user?.email && <span className="text-xs text-muted-foreground">{user.email}</span>}
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    );
  }
  
  return (
    <Button onClick={handleLogin}>
      <User className="h-4 w-4 mr-2" />
      Sign in
    </Button>
  );
}