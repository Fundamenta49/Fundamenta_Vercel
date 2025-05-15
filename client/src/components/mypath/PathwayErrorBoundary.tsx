import React, { Component, ErrorInfo, PropsWithChildren } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorType: 'load' | 'navigation' | 'data' | 'unknown';
}

interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetQuery?: () => void;
  errorType?: 'load' | 'navigation' | 'data' | 'unknown';
}

// This component will catch errors in the component tree
class PathwayErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      errorType: props.errorType || 'unknown'
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error,
      errorType: 'unknown'
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error("Pathway component error:", error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = (): void => {
    // Reset the error state
    this.setState({ 
      hasError: false,
      error: undefined,
      errorInfo: undefined
    });
    
    // Call resetQuery if provided (for React Query errors)
    if (this.props.resetQuery) {
      this.props.resetQuery();
    }
  }

  render() {
    // If there's an error, render the error UI
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Otherwise, use our default error UI
      return <PathwayErrorFallback 
        error={this.state.error} 
        resetError={this.resetError}
        errorType={this.state.errorType}
      />;
    }

    // If there's no error, render the children
    return this.props.children;
  }
}

// Props for the error fallback component
interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
  errorType: 'load' | 'navigation' | 'data' | 'unknown';
}

// The fallback UI component that displays when an error occurs
function PathwayErrorFallback({ error, resetError, errorType }: ErrorFallbackProps) {
  const [, navigate] = useLocation();
  
  const getErrorMessage = (): string => {
    switch (errorType) {
      case 'load':
        return "We couldn't load your pathway content. This might be due to network issues or the content is temporarily unavailable.";
      case 'navigation':
        return "We encountered a problem while navigating between modules. Your progress has been saved.";
      case 'data':
        return "There was an issue with the pathway data. Your progress has been saved and we're working to resolve this.";
      case 'unknown':
      default:
        return "Something unexpected happened while using the learning pathway. Your progress has been saved.";
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-red-100">
      <CardHeader className="bg-red-50 text-red-800">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <CardTitle className="text-lg">Pathway Error</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="mb-4">{getErrorMessage()}</p>
        
        {error && (
          <div className="text-sm bg-gray-50 p-3 rounded border border-gray-200 mb-4 overflow-auto">
            <p className="font-mono text-red-600">{error.message}</p>
          </div>
        )}
        
        <p className="text-sm text-gray-600">
          If this problem persists, please contact support for assistance.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between bg-gray-50">
        <Button 
          variant="outline" 
          onClick={() => navigate('/mypath')}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Return to MyPath
        </Button>
        
        <Button 
          onClick={resetError}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
}

// High-level component that combines the class component with React hooks
export function PathwayErrorBoundary(props: ErrorBoundaryProps) {
  return <PathwayErrorBoundaryClass {...props} />;
}

// Specialized error components for different error types
export function PathwayLoadErrorBoundary(props: Omit<ErrorBoundaryProps, 'errorType'>) {
  return <PathwayErrorBoundary {...props} errorType="load" />;
}

export function PathwayNavigationErrorBoundary(props: Omit<ErrorBoundaryProps, 'errorType'>) {
  return <PathwayErrorBoundary {...props} errorType="navigation" />;
}

export function PathwayDataErrorBoundary(props: Omit<ErrorBoundaryProps, 'errorType'>) {
  return <PathwayErrorBoundary {...props} errorType="data" />;
}