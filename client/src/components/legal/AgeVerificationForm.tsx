import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Cake, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface AgeVerificationData {
  birthYear: number;
  isMinor: boolean;
  ageVerified: boolean;
  hasParentalConsent: boolean;
}

interface AgeVerificationFormProps {
  onVerify: (data: AgeVerificationData) => void;
  onCancel?: () => void;
  showCancel?: boolean;
  className?: string;
  defaultBirthYear?: string;
}

export function AgeVerificationForm({
  onVerify,
  onCancel,
  showCancel = false,
  className = '',
  defaultBirthYear = '',
}: AgeVerificationFormProps) {
  const [birthYear, setBirthYear] = useState<string>(defaultBirthYear);
  const [ageVerification, setAgeVerification] = useState<boolean>(false);
  const [parentalConsent, setParentalConsent] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ age?: string; verification?: string; consent?: string }>({});
  const { toast } = useToast();
  
  // Constants for age requirements
  const MIN_AGE_WITHOUT_CONSENT = 13;
  const MINOR_AGE_CUTOFF = 18;

  const handleVerify = () => {
    // Reset errors
    setErrors({});
    
    if (!birthYear) {
      setErrors(prev => ({ ...prev, age: 'Please select your birth year' }));
      return;
    }
    
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear, 10);
    
    // Check if user meets minimum age requirement (COPPA compliance)
    if (age < MIN_AGE_WITHOUT_CONSENT) {
      setErrors(prev => ({ 
        ...prev, 
        age: `You must be at least ${MIN_AGE_WITHOUT_CONSENT} years old to create an account` 
      }));
      return;
    }
    
    // Check if age verification is confirmed
    if (!ageVerification) {
      setErrors(prev => ({ 
        ...prev, 
        verification: 'You must confirm your age' 
      }));
      return;
    }
    
    // If user is a minor (13-17), check for parental consent
    const isMinor = age < MINOR_AGE_CUTOFF;
    if (isMinor && !parentalConsent) {
      setErrors(prev => ({ 
        ...prev, 
        consent: 'Parental consent is required for users under 18 years old' 
      }));
      return;
    }
    
    // All verification passed
    onVerify({
      birthYear: parseInt(birthYear, 10),
      isMinor,
      ageVerified: true,
      hasParentalConsent: !isMinor || parentalConsent
    });
    
    toast({
      title: 'Age verification complete',
      description: isMinor 
        ? 'Your age has been verified with parental consent' 
        : 'Your age has been verified',
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cake className="h-5 w-5" />
          Age Verification
        </CardTitle>
        <CardDescription>
          We need to verify your age to ensure appropriate content access
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertTitle>Why we need this information</AlertTitle>
          <AlertDescription>
            We collect this information to comply with laws protecting minors online 
            and to ensure appropriate content is provided based on your age.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="birth-year">Year of Birth</Label>
          <Select value={birthYear} onValueChange={setBirthYear}>
            <SelectTrigger id="birth-year" className={errors.age ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {Array.from({ length: 100 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.age && (
            <p className="text-xs text-destructive mt-1">{errors.age}</p>
          )}
        </div>
        
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="age-verification" 
              checked={ageVerification}
              onCheckedChange={(checked) => setAgeVerification(checked as boolean)}
            />
            <Label htmlFor="age-verification" className="text-sm leading-tight">
              I confirm that the birth year I provided is accurate
            </Label>
          </div>
          {errors.verification && (
            <p className="text-xs text-destructive">{errors.verification}</p>
          )}
          
          {parseInt(birthYear, 10) > 0 && 
           new Date().getFullYear() - parseInt(birthYear, 10) < MINOR_AGE_CUTOFF && 
           new Date().getFullYear() - parseInt(birthYear, 10) >= MIN_AGE_WITHOUT_CONSENT && (
            <div className="mt-4 space-y-2">
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Parental Consent Required</AlertTitle>
                <AlertDescription>
                  Since you are under 18, parental consent is required to use this platform.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="parental-consent" 
                  checked={parentalConsent}
                  onCheckedChange={(checked) => setParentalConsent(checked as boolean)}
                />
                <Label htmlFor="parental-consent" className="text-sm leading-tight">
                  I confirm that I have parental consent to use this platform
                </Label>
              </div>
              {errors.consent && (
                <p className="text-xs text-destructive">{errors.consent}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {showCancel && onCancel && (
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button onClick={handleVerify} className="flex-1">
          Verify Age
        </Button>
      </CardFooter>
    </Card>
  );
}