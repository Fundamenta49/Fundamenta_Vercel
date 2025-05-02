import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CalendarIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    ageVerification: false 
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);
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
    const { name, email, password, confirmPassword, birthYear, ageVerification, agreeTerms } = registerData;
    
    // Validation
    if (!name || !email || !password || !confirmPassword || !birthYear) {
      setError('All fields are required');
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
    
    // Age verification
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear, 10);
    
    if (age < 13) {
      setAgeError('You must be at least 13 years old to use this platform');
      return;
    }
    
    if (!ageVerification) {
      setAgeError('You must confirm you are at least 13 years old');
      return;
    }
    
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    // All validation passed, sign up the user
    // Phase 2: We now store age verification data in the database
    const birthYearInt = parseInt(birthYear, 10);
    // Use birthYearNum instead to avoid redeclaration
    const birthYearNum = birthYearInt;
    const userAge = new Date().getFullYear() - birthYearNum;
    const userIsMinor = userAge < 18;
    
    // We will pass this metadata to the signup process
    const userMetadata = {
      birthYear: birthYearNum,
      ageVerified: true,
      isMinor: userIsMinor,
      // For minors between 13-18, we will set hasParentalConsent to false
      // until we implement the parental consent system in Phase 3
      hasParentalConsent: !userIsMinor
    };
    
    const success = await signUp(name, email, password, userMetadata);
    if (success) {
      // We still keep localStorage for backward compatibility
      try {
        localStorage.setItem('userAgeVerified', 'true');
        localStorage.setItem('userBirthYear', birthYear);
      } catch (err) {
        // Silent catch - this is just for an extra layer of tracking
        console.error("Could not save age verification to localStorage");
      }
      
      setLocation('/');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
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
                      <Label htmlFor="birth-year">Year of Birth</Label>
                      <Select 
                        value={registerData.birthYear} 
                        onValueChange={(value) => handleSelectChange('birthYear', value)}
                      >
                        <SelectTrigger id="birth-year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
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
                      {ageError && (
                        <p className="text-xs text-destructive mt-1">{ageError}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox 
                        id="age-verification" 
                        checked={registerData.ageVerification}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('ageVerification', checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="age-verification"
                        className="text-sm leading-tight"
                      >
                        I confirm that I am at least 13 years of age
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-2">
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
                        I agree to the <a href="/terms-of-service" className="underline text-primary">Terms of Service</a> and <a href="/privacy-policy" className="underline text-primary">Privacy Policy</a>
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