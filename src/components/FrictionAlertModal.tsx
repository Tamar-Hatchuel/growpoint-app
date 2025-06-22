
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';

interface FrictionAlertModalProps {
  open: boolean;
  onClose: () => void;
  onViewSuggestions: () => void;
  teamName: string;
  frictionScore: number;
}

const FrictionAlertModal: React.FC<FrictionAlertModalProps> = ({
  open,
  onClose,
  onViewSuggestions,
  teamName,
  frictionScore,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto border-red-200 bg-red-50 relative">
        {/* Close button in top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-red-100 transition-colors z-10"
          aria-label="Close alert"
        >
          <X className="w-5 h-5 text-red-600" />
        </button>

        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <DialogTitle className="text-xl font-bold text-red-800">
            ⚠️ High Friction Detected
          </DialogTitle>
          
          <DialogDescription className="text-red-700 text-base leading-relaxed">
            Your {teamName} team shows elevated friction levels ({frictionScore.toFixed(1)}/5). 
            Review team suggestions to take action now.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-6">
          <Button
            onClick={onViewSuggestions}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
          >
            View Team Suggestions
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-red-300 text-red-700 hover:bg-red-100"
          >
            Dismiss
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FrictionAlertModal;
