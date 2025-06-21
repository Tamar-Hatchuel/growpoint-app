
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Heart, Users } from 'lucide-react';

interface ThankYouScreenProps {
  onBack: () => void;
}

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-growpoint-dark hover:text-growpoint-accent hover:bg-growpoint-soft/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Card className="border-growpoint-accent/20 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-growpoint-primary to-growpoint-accent rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-growpoint-dark">
              Thank You!
            </CardTitle>
            <CardDescription className="text-lg text-growpoint-dark/80">
              Thanks for your input! Your feedback helps your team grow.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-growpoint-dark/70">
                <Heart className="w-5 h-5 text-growpoint-primary" />
                <span>Your voice matters to us</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-growpoint-dark/70">
                <Users className="w-5 h-5 text-growpoint-primary" />
                <span>Together we build stronger teams</span>
              </div>
            </div>
            
            <div className="bg-growpoint-soft/50 rounded-lg p-4">
              <p className="text-sm text-growpoint-dark/70">
                Your feedback has been recorded and will contribute to valuable insights 
                that help improve team dynamics and collaboration.
              </p>
            </div>

            <Button
              onClick={onBack}
              className="w-full bg-growpoint-primary hover:bg-growpoint-accent text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYouScreen;
