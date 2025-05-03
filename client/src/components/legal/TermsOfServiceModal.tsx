import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from '@/lib/auth-context';

interface TermsOfServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept?: () => void;
  showCheckbox?: boolean;
  isRequired?: boolean;
  tosVersion?: number;
}

export function TermsOfServiceModal({
  open,
  onOpenChange,
  onAccept,
  showCheckbox = true,
  isRequired = true,
  tosVersion,
}: TermsOfServiceModalProps) {
  const [termsContent, setTermsContent] = useState<string>('');
  const [version, setVersion] = useState<number>(tosVersion || 1);
  const [effectiveDate, setEffectiveDate] = useState<string>('');
  const [accepted, setAccepted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [tosLoading, setTosLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      fetchTermsOfService();
    }
  }, [open]);

  const fetchTermsOfService = async () => {
    try {
      setTosLoading(true);
      const response = await fetch('/api/legal/terms-of-service');
      
      if (!response.ok) {
        throw new Error('Failed to fetch Terms of Service');
      }
      
      const data = await response.json();
      setTermsContent(data.content);
      setVersion(data.version);
      // Format date nicely
      const date = new Date(data.effectiveDate);
      setEffectiveDate(date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    } catch (error) {
      console.error('Error fetching Terms of Service:', error);
      toast({
        title: "Error",
        description: "Failed to load Terms of Service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTosLoading(false);
    }
  };

  const handleAccept = async () => {
    if (isRequired && !accepted && showCheckbox) {
      toast({
        title: "Please confirm",
        description: "You must confirm that you have read and agree to the Terms of Service.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // If the user is authenticated, send the acceptance to the server
      if (user) {
        const response = await fetch('/api/legal/terms-of-service/accept', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            accepted: true,
            version: version,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to accept Terms of Service');
        }
      } 
      
      // Call the provided onAccept function if any
      if (onAccept) {
        onAccept();
      }
      
      // Show success toast
      toast({
        title: "Success",
        description: "You have successfully accepted the Terms of Service.",
      });
      
      // Close the modal
      onOpenChange(false);
    } catch (error) {
      console.error('Error accepting Terms of Service:', error);
      toast({
        title: "Error",
        description: "Failed to accept Terms of Service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">Terms of Service</AlertDialogTitle>
          <AlertDialogDescription>
            Version {version} - Effective {effectiveDate}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {tosLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto my-4 p-4 bg-muted/20 rounded-md text-sm">
              <div dangerouslySetInnerHTML={{ __html: termsContent }} />
            </div>
            
            {showCheckbox && (
              <div className="flex items-start space-x-2 mb-4">
                <Checkbox 
                  id="accept-terms" 
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked as boolean)}
                  className="mt-1"
                />
                <Label
                  htmlFor="accept-terms"
                  className="text-sm leading-tight"
                >
                  I have read and agree to the Terms of Service
                </Label>
              </div>
            )}
          </>
        )}
        
        <AlertDialogFooter className="gap-2 sm:gap-0">
          {!isRequired && (
            <AlertDialogCancel disabled={loading}>
              Close
            </AlertDialogCancel>
          )}
          
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleAccept();
            }}
            disabled={loading || tosLoading || (isRequired && showCheckbox && !accepted)}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting...
              </>
            ) : (
              "Accept Terms"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}