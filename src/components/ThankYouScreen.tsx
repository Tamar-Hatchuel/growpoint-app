
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Users } from 'lucide-react';

interface ThankYouScreenProps {
  onBack: () => void;
  onRestart: () => void;
  userName?: string;
}

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ onBack, onRestart, userName }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-growpoint-dark hover:text-growpoint-accent hover:bg-growpoint-soft/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Card className="border-growpoint-accent/20 shadow-lg text-center">
          <CardHeader className="pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-growpoint-primary to-growpoint-accent p-4 rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-growpoint-dark">
              Thank You{userName ? `, ${userName}` : ''}!
            </CardTitle>
            <CardDescription className="text-growpoint-dark/70 text-lg">
              Thanks for your input! Your feedback helps your team grow.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-growpoint-soft/50 rounded-lg p-6">
              <Users className="w-12 h-12 text-growpoint-primary mx-auto mb-3" />
              <p className="text-growpoint-dark font-medium mb-2">
                Your Voice Matters
              </p>
              <p className="text-sm text-growpoint-dark/70">
                Every piece of feedback contributes to building stronger, more collaborative teams. 
                Thank you for being part of your team's growth journey.
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button
                onClick={onRestart}
                className="w-full bg-growpoint-primary hover:bg-growpoint-accent text-white font-semibold py-3 rounded-lg transition-all duration-200"
              >
                Take Survey Again
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full border-growpoint-accent text-growpoint-dark hover:bg-growpoint-accent hover:text-white"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYouScreen;
