import React from 'react';
import { ClosingCostCalculator } from './closing-cost-calculator-new';
import { FullScreenDialog, FullScreenDialogContent, FullScreenDialogHeader, FullScreenDialogTitle, FullScreenDialogBody, FullScreenDialogClose } from '@/components/ui/full-screen-dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ClosingCostCalculatorFullscreenProps {
  onClose: () => void;
}

const ClosingCostCalculatorFullscreen: React.FC<ClosingCostCalculatorFullscreenProps> = ({ onClose }) => {
  return (
    <FullScreenDialog open={true} onOpenChange={onClose}>
      <FullScreenDialogContent themeColor="#22c55e">
        <FullScreenDialogHeader>
          <FullScreenDialogTitle>Closing Cost Calculator</FullScreenDialogTitle>
          <FullScreenDialogClose asChild>
            <Button 
              variant="ghost" 
              className="absolute right-4 top-4 rounded-full h-10 w-10 p-0 border-2 border-green-500"
              onClick={onClose}
            >
              <X className="h-6 w-6 text-green-600" />
              <span className="sr-only">Close</span>
            </Button>
          </FullScreenDialogClose>
        </FullScreenDialogHeader>
        
        <FullScreenDialogBody>
          <ClosingCostCalculator onClose={onClose} isWrappedInFullscreen={true} />
        </FullScreenDialogBody>
      </FullScreenDialogContent>
    </FullScreenDialog>
  );
};

export default ClosingCostCalculatorFullscreen;