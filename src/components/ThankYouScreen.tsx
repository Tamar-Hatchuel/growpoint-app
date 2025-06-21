
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart } from 'lucide-react';

interface ThankYouScreenProps {
  onRestart: () => void;
}

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ onRestart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-growpoint-accent/20 shadow-lg text-center">
          <CardHeader className="pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-growpoint-dark mb-2">
              Thank You!
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <p className="text-lg text-growpoint-dark/80">
                Thanks for your input! Your feedback helps your team grow.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-growpoint-accent">
                <Heart className="w-5 h-5 fill-current" />
                <span className="text-sm font-medium">We appreciate your participation</span>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={onRestart}
                  variant="ghost"
                  className="text-growpoint-primary hover:text-growpoint-accent hover:bg-growpoint-soft/50"
                >
                  Start Over
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYouScreen;
