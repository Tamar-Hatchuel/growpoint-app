
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClipboardList, X } from 'lucide-react';

interface SurveyConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onStartSurvey: () => void;
}

const SurveyConfirmationModal: React.FC<SurveyConfirmationModalProps> = ({
  open,
  onClose,
  onStartSurvey
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-growpoint-accent/20 bg-white">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full" style={{ backgroundColor: '#FFB4A2' }}>
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold" style={{ color: '#B5828C' }}>
            Ready to fill out the survey?
          </DialogTitle>
          <DialogDescription className="text-growpoint-dark/70 mt-2">
            This process takes 2–3 minutes and is completely anonymous. Your feedback helps improve team dynamics.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={onStartSurvey}
            className="w-full font-semibold py-3 rounded-lg text-white transition-all duration-200 transform hover:scale-[1.02]"
            style={{ backgroundColor: '#FFB4A2' }}
          >
            Start Survey
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft font-semibold py-3 rounded-lg transition-all duration-200"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyConfirmationModal;
