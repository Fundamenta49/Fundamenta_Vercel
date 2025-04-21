import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';

/**
 * A safer version of FormProvider that catches errors related to form context
 */
export const SafeFormProvider = ({ 
  form, 
  children,
  fallback = null
}: { 
  form: UseFormReturn<any> | null | undefined; 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  if (!form) {
    console.error("Form is not available in SafeFormProvider");
    return <>{fallback}</>;
  }

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
};