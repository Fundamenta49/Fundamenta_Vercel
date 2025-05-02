import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Settings, Upload, LogIn } from 'lucide-react';

const UserProfileHeader: React.FC = () => {
  const [, navigate] = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize profile image from localStorage if available
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    // Additional cleanup if needed
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleLogin = () => {
    // Navigate to the login/auth page
    navigate('/auth');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setProfileImage(imageData);
        // Save to localStorage for persistence
        localStorage.setItem('profileImage', imageData);
        toast({
          title: "Profile updated",
          description: "Your profile image has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(' ')
      .map((part: string) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarImage src={profileImage || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              <span>Change profile picture</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          onClick={handleLogin} 
          variant="outline" 
          className="flex items-center gap-2 bg-white/90 hover:bg-white"
        >
          <LogIn className="h-4 w-4" />
          <span>Log in</span>
        </Button>
      )}

      {/* Profile Image Upload Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Image</DialogTitle>
            <DialogDescription>
              Upload a new profile picture. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 border-2 border-primary/10">
                <AvatarImage src={profileImage || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-image" className="text-sm font-medium">
                Upload new image
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button type="button" size="icon" variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setProfileDialogOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfileHeader;