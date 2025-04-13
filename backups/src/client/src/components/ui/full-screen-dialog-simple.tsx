import React from 'react';
import {
  FullScreenDialog as BaseFullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogBody,
  FullScreenDialogFooter,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogClose
} from './full-screen-dialog';
import { Button } from './button';
import { X } from 'lucide-react';

interface FullScreenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  themeColor?: string;
  footerContent?: React.ReactNode;
}

export function SimpleFullScreenDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  themeColor = "#22c55e", // Default to green for finance
  footerContent
}: FullScreenDialogProps) {
  return (
    <BaseFullScreenDialog open={isOpen} onOpenChange={onClose}>
      <FullScreenDialogContent themeColor={themeColor}>
        {(title || description) && (
          <FullScreenDialogHeader>
            {title && <FullScreenDialogTitle>{title}</FullScreenDialogTitle>}
            {description && <FullScreenDialogDescription>{description}</FullScreenDialogDescription>}
            
            {/* Top close button removed to rely on swipe to close */}
          </FullScreenDialogHeader>
        )}
        
        <FullScreenDialogBody>
          {children}
          
          {/* Bottom close button removed to rely on swipe to close */}
        </FullScreenDialogBody>
        
        {footerContent && (
          <FullScreenDialogFooter>
            {footerContent}
          </FullScreenDialogFooter>
        )}
      </FullScreenDialogContent>
    </BaseFullScreenDialog>
  );
}