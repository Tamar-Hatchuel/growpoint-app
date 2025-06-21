
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RestartConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const RestartConfirmationModal: React.FC<RestartConfirmationModalProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent className="border-growpoint-accent/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-growpoint-dark">
            Are you sure you want to restart?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-growpoint-dark/70">
            Previous insights will be cleared and you'll need to complete the survey again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onCancel}
            className="border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-growpoint-primary hover:bg-growpoint-accent text-white"
          >
            Restart
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RestartConfirmationModal;
