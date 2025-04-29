import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Settings,
  ShieldCheck,
  LogOut,
  Map,
  Compass,
  Tent,
  Bell,
  BellOff,
  User,
  Edit,
  SunMoon,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { PrivacyConsentModal } from "./privacy/PrivacyConsentModal";
import { Separator } from "@/components/ui/separator";
import { useJungleTheme } from "@/jungle-path/contexts/JungleThemeContext";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";

export function AccountSettings() {
  const [open, setOpen] = useState(false);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('notifications_enabled') === 'true'
  );
  const [selectedTab, setSelectedTab] = useState('profile');
  const [interfaceContrast, setInterfaceContrast] = useState(
    parseInt(localStorage.getItem('interface_contrast') || '50')
  );
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    displayName: '',
    email: '',
    bio: ''
  });
  
  const { toast } = useToast();
  const { logout, user } = useAuth();
  const { isJungleTheme } = useJungleTheme();
  
  // Fetch user profile on initial load
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUserProfile({
            displayName: userData.name || userData.username || '',
            email: userData.email || '',
            bio: userData.bio || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    if (open) {
      fetchUserProfile();
    }
  }, [open]);
  
  // Check if we're in a minimized state
  const isMinimized = () => {
    return document.body.classList.contains('sidebar-minimized');
  };
  
  const handleOpenSettings = () => {
    setOpen(true);
  };

  const handleWithdrawConsent = async () => {
    try {
      // Call API to withdraw consent
      const response = await fetch('/api/auth/consent', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        // Show the consent modal to get consent again
        localStorage.removeItem('privacy_consent');
        setShowPrivacyConsent(true);
        setOpen(false);
        
        toast({
          title: "Privacy Consent Withdrawn",
          description: "You'll need to provide consent again to continue using all features.",
          variant: "default",
        });
      } else {
        throw new Error('Failed to withdraw consent');
      }
    } catch (error) {
      console.error('Error withdrawing privacy consent:', error);
      toast({
        title: "Error",
        description: "Failed to withdraw your privacy consent. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePrivacyConsent = async () => {
    toast({
      title: "Privacy settings updated",
      description: "Your privacy preferences have been saved.",
    });
    setShowPrivacyConsent(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
    setOpen(false);
  };
  
  const handleToggleNotifications = (checked: boolean) => {
    setNotificationsEnabled(checked);
    localStorage.setItem('notifications_enabled', checked.toString());
    
    // Request permissions if enabling notifications
    if (checked && "Notification" in window) {
      Notification.requestPermission();
    }
    
    toast({
      title: checked ? "Notifications Enabled" : "Notifications Disabled",
      description: checked 
        ? "You'll receive important updates and reminders." 
        : "You won't receive notifications from the app.",
    });
  };
  
  const handleContrastChange = (value: number[]) => {
    setInterfaceContrast(value[0]);
    localStorage.setItem('interface_contrast', value[0].toString());
    
    // Apply contrast setting (this is just a placeholder)
    // In a real implementation, you'd apply CSS variables or classes
    document.documentElement.style.setProperty('--interface-contrast', `${value[0]}%`);
    
    toast({
      title: "Display Settings Updated",
      description: "Your interface contrast preferences have been saved.",
    });
  };
  
  const handleProfileUpdate = async () => {
    // In a real implementation, you'd call an API to update the user profile
    // This is just a simplified demonstration
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
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
    <>
      {isMinimized() ? (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleOpenSettings}
          className="bg-white border-slate-300 text-gray-700 hover:bg-slate-50 mx-auto"
          title="Account Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleOpenSettings}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      )}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={cn(
          "sm:max-w-[475px] min-h-[550px]",
          isJungleTheme && "jungle-theme-dialog bg-[#1E4A3D] border-2 border-[#E6B933] text-white"
        )}>
          <DialogHeader>
            <DialogTitle className={isJungleTheme ? "text-[#E6B933]" : ""}>
              {isJungleTheme ? "Expedition Settings" : "Account Settings"}
            </DialogTitle>
            <DialogDescription className={isJungleTheme ? "text-[#94C973]" : ""}>
              {isJungleTheme 
                ? "Manage your explorer preferences and jungle permissions" 
                : "Manage your account preferences and privacy settings"}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs 
            defaultValue="profile" 
            value={selectedTab} 
            onValueChange={setSelectedTab}
            className="mt-2"
          >
            <TabsList className={cn(
              "grid w-full grid-cols-3", 
              isJungleTheme && "bg-[#162E26] border border-[#94C973]"
            )}>
              <TabsTrigger 
                value="profile" 
                className={cn(
                  isJungleTheme && "data-[state=active]:bg-[#1A3831] data-[state=active]:text-[#E6B933]"
                )}
              >
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className={cn(
                  isJungleTheme && "data-[state=active]:bg-[#1A3831] data-[state=active]:text-[#E6B933]"
                )}
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="display" 
                className={cn(
                  isJungleTheme && "data-[state=active]:bg-[#1A3831] data-[state=active]:text-[#E6B933]"
                )}
              >
                Display
              </TabsTrigger>
            </TabsList>
            
            <div className="h-[400px] mt-4 overflow-y-auto pr-1">
              <TabsContent value="profile" className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src="" alt={userProfile.displayName} />
                    <AvatarFallback className={cn(
                      "text-lg",
                      isJungleTheme ? "bg-[#94C973] text-[#1E4A3D]" : "bg-primary text-primary-foreground"
                    )}>
                      {getInitials(userProfile.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className={cn(
                      "text-lg font-medium",
                      isJungleTheme && "text-[#E6B933]"
                    )}>
                      {userProfile.displayName || "User"}
                    </h3>
                    <p className={cn(
                      "text-sm text-muted-foreground",
                      isJungleTheme && "text-[#94C973]"
                    )}>
                      {userProfile.email || "No email provided"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label 
                      htmlFor="displayName"
                      className={isJungleTheme ? "text-[#E6B933]" : ""}
                    >
                      Display Name
                    </Label>
                    <Input 
                      id="displayName" 
                      value={userProfile.displayName} 
                      onChange={(e) => setUserProfile({...userProfile, displayName: e.target.value})}
                      className={cn(
                        isJungleTheme && "bg-[#162E26] border-[#94C973] text-white"
                      )}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label 
                      htmlFor="bio"
                      className={isJungleTheme ? "text-[#E6B933]" : ""}
                    >
                      Bio
                    </Label>
                    <Input 
                      id="bio" 
                      value={userProfile.bio} 
                      onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                      className={cn(
                        isJungleTheme && "bg-[#162E26] border-[#94C973] text-white"
                      )}
                    />
                    <p className={cn(
                      "text-xs text-muted-foreground",
                      isJungleTheme && "text-[#94C973]"
                    )}>
                      A brief description about yourself
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleProfileUpdate}
                    className={cn(
                      "mt-2",
                      isJungleTheme && "bg-[#94C973] text-[#1E4A3D] hover:bg-[#7DAC5D]"
                    )}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </div>
                
                <Separator className={isJungleTheme ? "bg-[#94C973]/30" : ""} />
                
                <div className="space-y-2">
                  <h3 className={cn(
                    "text-sm font-medium",
                    isJungleTheme && "text-[#E6B933]"
                  )}>
                    {isJungleTheme ? "Jungle Permissions" : "Privacy"}
                  </h3>
                  <Button 
                    variant={isJungleTheme ? "default" : "outline"} 
                    className={cn(
                      "w-full justify-start text-left",
                      isJungleTheme && "bg-[#162E26] border-[#94C973] hover:bg-[#1A3831] text-[#94C973]"
                    )}
                    onClick={handleWithdrawConsent}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {isJungleTheme ? "Manage Jungle Access" : "Manage Privacy Consent"}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant={isJungleTheme ? "default" : "outline"} 
                    className={cn(
                      "w-full justify-start text-left",
                      isJungleTheme 
                        ? "bg-[#6D1A1D] border-[#FF6B70] hover:bg-[#7F1F22] text-[#FF6B70]" 
                        : "text-red-600 hover:text-red-700 hover:bg-red-50"
                    )}
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isJungleTheme ? "Leave Expedition" : "Logout"}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <Card className={cn(
                  "border",
                  isJungleTheme && "bg-[#162E26] border-[#94C973]"
                )}>
                  <CardContent className="pt-6 pb-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1.5">
                        <Label className={isJungleTheme ? "text-[#E6B933]" : ""}>
                          Enable Notifications
                        </Label>
                        <p className={cn(
                          "text-xs text-muted-foreground",
                          isJungleTheme && "text-[#94C973]"
                        )}>
                          Receive important updates and reminders
                        </p>
                      </div>
                      <Switch 
                        checked={notificationsEnabled} 
                        onCheckedChange={handleToggleNotifications}
                        className={isJungleTheme ? "data-[state=checked]:bg-[#94C973]" : ""}
                      />
                    </div>
                    
                    {notificationsEnabled && (
                      <>
                        <Separator className={isJungleTheme ? "bg-[#94C973]/30" : ""} />
                        
                        <div className="flex justify-between items-center opacity-50 cursor-not-allowed">
                          <div className="space-y-1.5">
                            <Label className={isJungleTheme ? "text-[#E6B933]" : ""}>
                              Learning Reminders
                            </Label>
                            <p className={cn(
                              "text-xs text-muted-foreground",
                              isJungleTheme && "text-[#94C973]"
                            )}>
                              Remind me about scheduled learning sessions
                            </p>
                          </div>
                          <Switch disabled className={isJungleTheme ? "data-[state=checked]:bg-[#94C973]" : ""} />
                        </div>
                        
                        <div className="flex justify-between items-center opacity-50 cursor-not-allowed">
                          <div className="space-y-1.5">
                            <Label className={isJungleTheme ? "text-[#E6B933]" : ""}>
                              Achievement Alerts
                            </Label>
                            <p className={cn(
                              "text-xs text-muted-foreground",
                              isJungleTheme && "text-[#94C973]"
                            )}>
                              Notify me when I earn achievements
                            </p>
                          </div>
                          <Switch disabled className={isJungleTheme ? "data-[state=checked]:bg-[#94C973]" : ""} />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <p className={cn(
                  "text-xs text-center text-muted-foreground",
                  isJungleTheme && "text-[#94C973]"
                )}>
                  Additional notification settings will be available soon
                </p>
              </TabsContent>
              
              <TabsContent value="display" className="space-y-4">
                <Card className={cn(
                  "border",
                  isJungleTheme && "bg-[#162E26] border-[#94C973]"
                )}>
                  <CardContent className="pt-6 pb-4 space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className={isJungleTheme ? "text-[#E6B933]" : ""}>
                          Interface Contrast
                        </Label>
                        <span className={cn(
                          "text-sm",
                          isJungleTheme && "text-[#94C973]"
                        )}>{interfaceContrast}%</span>
                      </div>
                      <Slider 
                        defaultValue={[interfaceContrast]} 
                        max={100} 
                        step={5}
                        onValueChange={handleContrastChange}
                        className={isJungleTheme ? "data-[state=checked]:bg-[#94C973]" : ""}
                      />
                      <p className={cn(
                        "text-xs text-muted-foreground",
                        isJungleTheme && "text-[#94C973]"
                      )}>
                        Adjust the contrast of the interface for better readability
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center opacity-50 cursor-not-allowed">
                      <div className="space-y-1.5">
                        <Label className={isJungleTheme ? "text-[#E6B933]" : ""}>
                          Text Size
                        </Label>
                        <p className={cn(
                          "text-xs text-muted-foreground",
                          isJungleTheme && "text-[#94C973]"
                        )}>
                          Adjust text size for better readability
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>A-</Button>
                        <Button variant="outline" size="sm" disabled>A+</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <p className={cn(
                  "text-xs text-center text-muted-foreground",
                  isJungleTheme && "text-[#94C973]"
                )}>
                  More display settings will be available in future updates
                </p>
              </TabsContent>
            </div>
          </Tabs>
          
          <DialogFooter>
            <Button 
              onClick={() => setOpen(false)}
              className={cn(
                isJungleTheme && "bg-[#E6B933] text-[#1E4A3D] hover:bg-[#DCAA14]"
              )}
            >
              {isJungleTheme ? "Return to Jungle" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showPrivacyConsent && (
        <PrivacyConsentModal 
          onConsent={handlePrivacyConsent}
          onDecline={() => setShowPrivacyConsent(false)}
        />
      )}
    </>
  );
}