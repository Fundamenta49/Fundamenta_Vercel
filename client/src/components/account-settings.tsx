import React, { useState } from 'react';
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
  Tent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { PrivacyConsentModal } from "./privacy/PrivacyConsentModal";
import { Separator } from "@/components/ui/separator";
import { useJungleTheme } from "@/jungle-path/contexts/JungleThemeContext";
import { cn } from "@/lib/utils";

export function AccountSettings() {
  const [open, setOpen] = useState(false);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();
  const { isJungleTheme } = useJungleTheme();
  
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
          "sm:max-w-[425px]",
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
          
          <div className="space-y-4 py-4">
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

            <Separator className={isJungleTheme ? "bg-[#94C973]/30" : ""} />
            
            <div className="space-y-2">
              <h3 className={cn(
                "text-sm font-medium",
                isJungleTheme && "text-[#E6B933]"
              )}>
                {isJungleTheme ? "Explorer Profile" : "Account"}
              </h3>
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
          </div>
          
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