import React, { Component, ErrorInfo, PropsWithChildren } from 'react';
import { AlertCircle, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

/**
 * PathwayErrorBoundary is a class component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * This implementation is designed specifically for the Pathway feature to provide contextual error handling
 * with appropriate recovery options based on the error type.
 */
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
    console.error('Pathway error boundary caught an error:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    this.setState({
      errorInfo,
      errorType: this.props.errorType || 'unknown'
    });
  }

  resetError = (): void => {
    // Reset error state
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined
    });
    
    // Reset query if callback provided
    if (this.props.resetQuery) {
      this.props.resetQuery();
    }
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return this.props.fallback || (
        <PathwayErrorFallback 
          error={this.state.error} 
          resetError={this.resetError} 
          errorType={this.state.errorType}
        />
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
  errorType: 'load' | 'navigation' | 'data' | 'unknown';
}

/**
 * Provides a contextual error display with appropriate recovery options based on the error type.
 */
function PathwayErrorFallback({ error, resetError, errorType }: ErrorFallbackProps) {
  const getErrorMessage = () => {
    switch (errorType) {
      case 'load':
        return {
          title: 'Failed to load pathway content',
          description: 'We could not load the learning pathway. This might be due to a network issue or the content may be temporarily unavailable.',
          primaryAction: { label: 'Try Again', icon: <RefreshCcw className="h-4 w-4 mr-2" /> },
          secondaryAction: { label: 'Go Back', icon: <ArrowLeft className="h-4 w-4 mr-2" /> }
        };
      case 'navigation':
        return {
          title: 'Navigation Error',
          description: 'We encountered a problem while trying to navigate to the requested content. The page or content may not exist or you may not have access to it.',
          primaryAction: { label: 'Go to Dashboard', icon: <ArrowLeft className="h-4 w-4 mr-2" /> },
          secondaryAction: { label: 'Try Again', icon: <RefreshCcw className="h-4 w-4 mr-2" /> }
        };
      case 'data':
        return {
          title: 'Data Loading Error',
          description: 'There was a problem loading the data for this pathway. This could be due to a network issue or a problem with the data source.',
          primaryAction: { label: 'Refresh Data', icon: <RefreshCcw className="h-4 w-4 mr-2" /> },
          secondaryAction: { label: 'Go Back', icon: <ArrowLeft className="h-4 w-4 mr-2" /> }
        };
      default:
        return {
          title: 'Something went wrong',
          description: 'We encountered an unexpected error. Our team has been notified and is working on a fix.',
          primaryAction: { label: 'Try Again', icon: <RefreshCcw className="h-4 w-4 mr-2" /> },
          secondaryAction: { label: 'Go Back', icon: <ArrowLeft className="h-4 w-4 mr-2" /> }
        };
    }
  };

  const errorContent = getErrorMessage();
  
  return (
    <Card className="border-red-200 bg-red-50 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center p-4">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            {errorContent.title}
          </h3>
          <p className="text-red-600 mb-4 max-w-md">
            {errorContent.description}
          </p>
          
          {error && (
            <div className="bg-white p-3 rounded border border-red-100 mb-4 w-full overflow-auto max-h-24 text-left">
              <p className="text-xs text-gray-700 font-mono">
                {error.toString()}
              </p>
            </div>
          )}
          
          <div className="flex gap-3 mt-2">
            <Button 
              onClick={resetError} 
              variant="default" 
              className="bg-red-600 hover:bg-red-700"
            >
              {errorContent.primaryAction.icon}
              {errorContent.primaryAction.label}
            </Button>
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              {errorContent.secondaryAction.icon}
              {errorContent.secondaryAction.label}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main export - A functional component wrapper around the class component.
 * This makes it easier to use and more consistent with modern React patterns.
 */
export function PathwayErrorBoundary(props: ErrorBoundaryProps) {
  return <PathwayErrorBoundaryClass {...props} />;
}

/**
 * Specialized error boundary for content loading errors.
 */
export function PathwayLoadErrorBoundary(props: Omit<ErrorBoundaryProps, 'errorType'>) {
  return <PathwayErrorBoundary {...props} errorType="load" />;
}

/**
 * Specialized error boundary for navigation errors.
 */
export function PathwayNavigationErrorBoundary(props: Omit<ErrorBoundaryProps, 'errorType'>) {
  return <PathwayErrorBoundary {...props} errorType="navigation" />;
}

/**
 * Specialized error boundary for data loading errors.
 */
export function PathwayDataErrorBoundary(props: Omit<ErrorBoundaryProps, 'errorType'>) {
  return <PathwayErrorBoundary {...props} errorType="data" />;
}