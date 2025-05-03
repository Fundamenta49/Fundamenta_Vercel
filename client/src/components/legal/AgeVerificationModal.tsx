import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AgeVerificationForm, AgeVerificationData } from './AgeVerificationForm';

interface AgeVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (data: AgeVerificationData) => void;
  onCancel?: () => void;
}

export function AgeVerificationModal({
  open,
  onOpenChange,
  onVerify,
  onCancel,
}: AgeVerificationModalProps) {
  const handleVerify = (data: AgeVerificationData) => {
    onVerify(data);
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Age Verification</AlertDialogTitle>
          <AlertDialogDescription>
            Please verify your age to continue using our platform.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AgeVerificationForm 
          onVerify={handleVerify} 
          onCancel={handleCancel}
          showCancel={true}
          className="border-none shadow-none"
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}