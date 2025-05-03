import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CalendarIcon, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TermsOfServiceModal, AgeVerificationModal, AgeVerificationData } from '@/components/legal';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    birthYear: '', 
    agreeTerms: false,
    ageVerification: false,
    hasParentalConsent: false
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);
  const [showTosModal, setShowTosModal] = useState<boolean>(false);
  const [showAgeVerificationModal, setShowAgeVerificationModal] = useState<boolean>(false);
  const [ageVerificationData, setAgeVerificationData] = useState<AgeVerificationData | null>(null);
  const { login, signUp, loading, error, setError } = useAuth();
  const [, setLocation] = useLocation();

  // Check if user is already logged in
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    setLocation('/');
    return null;
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (passwordError) setPasswordError(null);
    if (ageError) setAgeError(null);
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setRegisterData(prev => ({ ...prev, [name]: checked }));
    if (error) setError(null);
    if (name === 'ageVerification' && ageError) setAgeError(null);
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setRegisterData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (name === 'birthYear' && ageError) setAgeError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = loginData;
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      setLocation('/');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, birthYear, ageVerification, agreeTerms, hasParentalConsent } = registerData;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All name, email, and password fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    // Age verification - we now use our enhanced verification process
    if (!birthYear || !ageVerification) {
      setAgeError('Please complete the age verification process');
      setShowAgeVerificationModal(true);
      return;
    }
    
    // Check if the user is a minor and requires parental consent
    const currentYear = new Date().getFullYear();
    const userAge = currentYear - parseInt(birthYear, 10);
    const userIsMinor = userAge < 18;
    
    // If user is a minor (13-17), they need parental consent
    if (userIsMinor && !hasParentalConsent) {
      setAgeError('Parental consent is required for users under 18 years old');
      setShowAgeVerificationModal(true);
      return;
    }
    
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      setShowTosModal(true);
      return;
    }
    
    // All validation passed, sign up the user
    // Enhanced age verification data from our verification process
    const userMetadata = {
      birthYear: parseInt(birthYear, 10),
      ageVerified: true,
      isMinor: userIsMinor,
      hasParentalConsent: userIsMinor ? hasParentalConsent : true
    };
    
    const success = await signUp(name, email, password, userMetadata);
    if (success) {
      // We still keep localStorage for backward compatibility
      try {
        localStorage.setItem('userAgeVerified', 'true');
        localStorage.setItem('userBirthYear', birthYear);
        if (userIsMinor) {
          localStorage.setItem('userHasParentalConsent', hasParentalConsent ? 'true' : 'false');
        }
      } catch (err) {
        // Silent catch - this is just for an extra layer of tracking
        console.error("Could not save age verification to localStorage");
      }
      
      setLocation('/');
    }
  };

  // Handle age verification from modal
  const handleAgeVerificationComplete = (data: AgeVerificationData) => {
    setAgeVerificationData(data);
    setRegisterData(prev => ({
      ...prev,
      birthYear: data.birthYear.toString(),
      ageVerification: true,
      hasParentalConsent: data.hasParentalConsent
    }));
    setAgeError(null);
  };

  // Handle terms of service acceptance
  const handleTermsAccept = () => {
    setRegisterData(prev => ({
      ...prev,
      agreeTerms: true
    }));
    setError(null);
  };

  // Open age verification modal
  const openAgeVerification = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAgeVerificationModal(true);
  };

  // Open terms of service modal
  const openTermsOfService = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTosModal(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Modals */}
      <TermsOfServiceModal
        open={showTosModal}
        onOpenChange={setShowTosModal}
        onAccept={handleTermsAccept}
        showCheckbox={true}
        isRequired={true}
      />
      
      <AgeVerificationModal
        open={showAgeVerificationModal}
        onOpenChange={setShowAgeVerificationModal}
        onVerify={handleAgeVerificationComplete}
      />
      
      {/* Left section with form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-center">Fundamenta Life Skills</h1>
          <p className="text-muted-foreground text-center mb-8">
            Accelerate your personal growth and development
          </p>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login to your account</CardTitle>
                  <CardDescription>
                    Enter your email and password to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLoginSubmit}>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        autoComplete="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button variant="link" className="p-0 h-auto text-xs" type="button">
                          Forgot password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        autoComplete="current-password"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                    <div className="w-full flex justify-between items-center">
                      <div className="h-px bg-border flex-1"></div>
                      <span className="px-2 text-xs text-muted-foreground">or</span>
                      <div className="h-px bg-border flex-1"></div>
                    </div>
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="w-full text-sm bg-gray-50 hover:bg-gray-100"
                      onClick={() => {
                        setLoginData({ email: 'admin@fundamenta.app', password: 'admin123' });
                        setTimeout(() => {
                          handleLoginSubmit({ preventDefault: () => {} } as React.FormEvent);
                        }, 100);
                      }}
                    >
                      Admin Quick Login
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Enter your details to create a new account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegisterSubmit}>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={registerData.name}
                        onChange={handleRegisterChange}
                        autoComplete="name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        autoComplete="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        autoComplete="new-password"
                      />
                      {passwordError && (
                        <p className="text-xs text-destructive mt-1">{passwordError}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <Label htmlFor="birth-year">Age Verification</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs flex items-center gap-1"
                          onClick={openAgeVerification}
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verify Age
                        </Button>
                      </div>
                      {registerData.birthYear ? (
                        <div className="bg-muted p-3 rounded-md">
                          <div className="flex justify-between text-sm">
                            <span>Birth Year:</span>
                            <span className="font-medium">{registerData.birthYear}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span>Status:</span>
                            <span className="font-medium text-green-600">
                              {registerData.ageVerification ? 'Verified' : 'Not Verified'}
                            </span>
                          </div>
                          {ageVerificationData?.isMinor && (
                            <div className="flex justify-between text-sm mt-1">
                              <span>Parental Consent:</span>
                              <span className={`font-medium ${registerData.hasParentalConsent ? 'text-green-600' : 'text-amber-600'}`}>
                                {registerData.hasParentalConsent ? 'Provided' : 'Required'}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-muted/50 border border-border rounded-md p-4 text-center">
                          <p className="text-sm text-muted-foreground">
                            Please verify your age to continue
                          </p>
                        </div>
                      )}
                      {ageError && (
                        <p className="text-xs text-destructive mt-1">{ageError}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox 
                        id="terms-agreement" 
                        checked={registerData.agreeTerms}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('agreeTerms', checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="terms-agreement"
                        className="text-sm leading-tight"
                      >
                        I agree to the{" "}
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-primary underline" 
                          onClick={openTermsOfService}
                        >
                          Terms of Service
                        </Button>
                        {" "}and{" "}
                        <a href="/privacy-policy" className="underline text-primary">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
          
          <p className="text-sm text-center text-muted-foreground mt-8">
            By using our platform, you agree to our{" "}
            <a href="/privacy-policy" className="underline text-primary">
              Privacy Policy
            </a>
            {" "}and{" "}
            <a href="/terms-of-service" className="underline text-primary">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
      
      {/* Right section with hero */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-primary/10 to-primary/20 justify-center items-center p-12">
        <div className="max-w-md space-y-6">
          <h2 className="text-4xl font-bold tracking-tight">
            Elevate Your Life Skills
          </h2>
          <p className="text-lg text-muted-foreground">
            Fundamenta offers personalized learning paths to help you develop essential
            life skills, financial literacy, health & wellness, and professional growth.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-1">Personalized Learning</h3>
              <p className="text-sm text-muted-foreground">
                Adaptive courses tailored to your unique learning style and goals.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-1">Expert Guidance</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered coaching to help you master new skills effectively.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-1">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Visualize your growth with detailed analytics and insights.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-1">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your data is protected with industry-leading security measures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}