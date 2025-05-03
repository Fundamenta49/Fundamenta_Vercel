import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function TermsOfServicePage() {
  const [termsContent, setTermsContent] = useState<string>('');
  const [version, setVersion] = useState<number>(1);
  const [effectiveDate, setEffectiveDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [accepted, setAccepted] = useState<boolean>(false);
  const [acceptLoading, setAcceptLoading] = useState<boolean>(false);
  const [userStatus, setUserStatus] = useState<{
    hasAccepted: boolean;
    currentVersion: number;
    userVersion: number | null;
    needsToAccept: boolean;
  }>({
    hasAccepted: false,
    currentVersion: 1,
    userVersion: null,
    needsToAccept: false,
  });
  
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchTermsOfService();
    if (isAuthenticated) {
      fetchUserTermsStatus();
    }
  }, [isAuthenticated]);

  const fetchTermsOfService = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };
  
  const fetchUserTermsStatus = async () => {
    try {
      const response = await fetch('/api/legal/terms-of-service/status', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated, don't show an error
          return;
        }
        throw new Error('Failed to fetch Terms of Service status');
      }
      
      const data = await response.json();
      setUserStatus({
        hasAccepted: data.userAccepted,
        currentVersion: data.currentVersion,
        userVersion: data.userVersion,
        needsToAccept: data.needsToAccept,
      });
    } catch (error) {
      console.error('Error fetching Terms of Service status:', error);
    }
  };
  
  const handleAcceptTerms = async () => {
    if (!accepted) {
      toast({
        title: "Please confirm",
        description: "You must confirm that you have read and agree to the Terms of Service.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to accept the Terms of Service.",
        variant: "destructive",
      });
      return;
    }
    
    setAcceptLoading(true);
    
    try {
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
      
      // Update user status
      await fetchUserTermsStatus();
      
      toast({
        title: "Success",
        description: "You have successfully accepted the Terms of Service.",
      });
    } catch (error) {
      console.error('Error accepting Terms of Service:', error);
      toast({
        title: "Error",
        description: "Failed to accept Terms of Service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAcceptLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">
            Version {version} - Effective {effectiveDate}
          </p>
        </div>
        
        {isAuthenticated && !loading && (
          <div className="flex items-center">
            {userStatus.hasAccepted && userStatus.userVersion === userStatus.currentVersion ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Accepted</span>
              </div>
            ) : (
              <div className="text-amber-600">
                {userStatus.hasAccepted 
                  ? "Update needed" 
                  : "Not yet accepted"}
              </div>
            )}
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Terms of Service Agreement
              </CardTitle>
              <CardDescription>
                Please read these terms carefully before using our platform
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 overflow-y-auto max-h-[60vh]">
              <div 
                className="prose prose-sm max-w-none dark:prose-invert" 
                dangerouslySetInnerHTML={{ __html: termsContent }}
              />
            </CardContent>
          </Card>
          
          {isAuthenticated && userStatus.needsToAccept && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox 
                    id="accept-terms" 
                    checked={accepted}
                    onCheckedChange={(checked) => setAccepted(checked as boolean)}
                  />
                  <Label
                    htmlFor="accept-terms"
                    className="text-sm leading-tight"
                  >
                    I have read and agree to the Terms of Service
                  </Label>
                </div>
                
                <Button 
                  onClick={handleAcceptTerms} 
                  disabled={!accepted || acceptLoading} 
                  className="w-full"
                >
                  {acceptLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Accepting Terms...
                    </>
                  ) : (
                    "Accept Terms of Service"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
          
          {isAuthenticated && !userStatus.needsToAccept && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>You have already accepted the current Terms of Service.</p>
            </div>
          )}
          
          {!isAuthenticated && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center mb-4">
                  Please log in to accept the Terms of Service.
                </p>
                <Link href="/auth">
                  <Button className="w-full">
                    Login or Register
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}