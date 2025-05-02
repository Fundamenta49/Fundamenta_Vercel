/**
 * Content Advisory Component
 * 
 * This component displays appropriate disclaimers and warnings for content
 * based on its category and severity.
 */

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

export type ContentAdvisorySeverity = 'low' | 'medium' | 'high';
export type ContentCategory = 
  | 'Mental Health' 
  | 'Financial Advice' 
  | 'Medical Information' 
  | 'Nutrition Guidance'
  | 'Exercise Instructions'
  | 'General Information';

export interface ContentAdvisoryProps {
  category: ContentCategory;
  severity: ContentAdvisorySeverity;
  disclaimer: string;
  readMore?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ContentAdvisory({
  category,
  severity,
  disclaimer,
  readMore,
  children,
  className = '',
}: ContentAdvisoryProps) {
  // Based on severity, choose appropriate styling and icon
  const getSeverityStyles = (): { variant: string; icon: React.ReactNode } => {
    switch (severity) {
      case 'high':
        return {
          variant: 'destructive',
          icon: <AlertCircle className="h-4 w-4" />,
        };
      case 'medium':
        return {
          variant: 'warning',
          icon: <AlertTriangle className="h-4 w-4" />,
        };
      case 'low':
      default:
        return {
          variant: 'info',
          icon: <Info className="h-4 w-4" />,
        };
    }
  };

  const { variant, icon } = getSeverityStyles();
  
  return (
    <div className={`content-advisory ${className}`}>
      <Alert variant={variant as any} className="mb-4">
        <div className="flex items-start">
          {icon}
          <div className="ml-2">
            <AlertTitle className="text-sm font-medium">{category} Advisory</AlertTitle>
            <AlertDescription className="text-sm mt-1">
              {disclaimer}
            </AlertDescription>
            
            {readMore && (
              <div className="mt-2">
                <Link href={readMore}>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Read more about {category.toLowerCase()}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Alert>
      
      {children && (
        <>
          <Separator className="my-4" />
          <div className="content-with-advisory">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

export interface ContentWithAdvisoryProps {
  advisory?: {
    category: ContentCategory;
    severity: ContentAdvisorySeverity;
    disclaimer: string;
    readMore?: string;
  } | null;
  children: React.ReactNode;
  className?: string;
  skipAdvisory?: boolean;
}

/**
 * Wrapper component that only shows an advisory if needed
 */
export function ContentWithAdvisory({
  advisory,
  children,
  className = '',
  skipAdvisory = false,
}: ContentWithAdvisoryProps) {
  // If no advisory or skipping advisory, just render children
  if (!advisory || skipAdvisory) {
    return <>{children}</>;
  }
  
  return (
    <ContentAdvisory
      category={advisory.category}
      severity={advisory.severity}
      disclaimer={advisory.disclaimer}
      readMore={advisory.readMore}
      className={className}
    >
      {children}
    </ContentAdvisory>
  );
}