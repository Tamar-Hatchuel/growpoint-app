
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Users, TrendingUp } from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ open, onClose, onStart }) => {
  const handleStart = () => {
    onStart();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto border-growpoint-accent/20">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-growpoint-primary to-growpoint-accent p-3 rounded-full">
              <img 
                src="/lovable-uploads/c3fcdded-87c5-4a78-b39e-2094a897384e.png" 
                alt="GrowPoint" 
                className="w-8 h-8" 
              />
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-growpoint-dark">
            Welcome to GrowPoint!
          </DialogTitle>
          
          <DialogDescription className="text-growpoint-dark/70 text-base leading-relaxed">
            Your feedback is anonymous and helps your team grow. Let's build stronger collaboration together.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-6">
          <div className="flex items-center gap-3 p-3 bg-growpoint-soft/30 rounded-lg">
            <Shield className="w-5 h-5 text-growpoint-primary" />
            <span className="text-sm text-growpoint-dark">100% Anonymous</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-growpoint-soft/30 rounded-lg">
            <Users className="w-5 h-5 text-growpoint-primary" />
            <span className="text-sm text-growpoint-dark">Team-focused insights</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-growpoint-soft/30 rounded-lg">
            <TrendingUp className="w-5 h-5 text-growpoint-primary" />
            <span className="text-sm text-growpoint-dark">AI-powered growth</span>
          </div>
        </div>
        
        <Button
          onClick={handleStart}
          className="w-full bg-growpoint-primary hover:bg-growpoint-accent text-white font-semibold py-3 rounded-lg"
        >
          Let's Start
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
