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
} from "../ui/alert-dialog";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface PrivacyConsentModalProps {
  onConsent: () => void;
  onDecline?: () => void;
}

export function PrivacyConsentModal({ onConsent, onDecline }: PrivacyConsentModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('privacy_consent') === 'true';
    
    if (!hasConsent) {
      setOpen(true);
    }
  }, []);

  const handleConsent = async () => {
    try {
      // Call API to record consent
      const response = await fetch('/api/auth/consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        // Store consent in local storage
        localStorage.setItem('privacy_consent', 'true');
        setOpen(false);
        onConsent();
        
        toast({
          title: "Privacy Consent Granted",
          description: "Thank you for consenting to our privacy policy.",
          variant: "default",
        });
      } else {
        throw new Error('Failed to record consent');
      }
    } catch (error) {
      console.error('Error recording privacy consent:', error);
      toast({
        title: "Error",
        description: "Failed to record your privacy consent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    }
    toast({
      title: "Consent Declined",
      description: "You have declined our privacy policy. Some features may be limited.",
      variant: "destructive",
    });
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-[500px] bg-white text-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-gray-900">Privacy Consent</AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Please review our privacy policy and consent to our data practices
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-2">
          <p className="font-medium text-gray-800">
            Your privacy is important to us at Fundamenta Life Skills.
          </p>
          
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              We use your personal information to provide and improve our services.
              This includes:
            </p>
            
            <ul className="list-disc pl-5 space-y-1">
              <li>Storing your data securely with encryption</li>
              <li>Personalizing your learning experience</li>
              <li>Providing progress tracking and recommendations</li>
              <li>Sending important notifications about your account</li>
            </ul>
            
            <p className="mt-4">
              We implement modern security practices including:
            </p>
            
            <ul className="list-disc pl-5 space-y-1">
              <li>Secure password hashing</li>
              <li>HTTPS-only connections</li>
              <li>JWT token authentication</li>
              <li>Regular security audits</li>
            </ul>
            
            <p className="mt-4">
              By clicking "I Consent", you acknowledge that you have read and
              understood our{" "}
              <Link 
                href="/privacy-policy" 
                className="text-orange-600 underline underline-offset-4"
              >
                Privacy Policy
              </Link>{" "}
              and consent to our data practices.
            </p>
            
            <p className="mt-4 text-sm italic">
              You may withdraw your consent at any time by visiting your account settings.
            </p>
          </div>
        </div>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={handleDecline} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
            Decline
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConsent} className="bg-orange-600 text-white hover:bg-orange-700">
            I Consent
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}