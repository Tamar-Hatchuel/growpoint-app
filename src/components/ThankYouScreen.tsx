
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart, Lightbulb, Home } from 'lucide-react';

interface ThankYouScreenProps {
  onRestart: () => void;
}

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ onRestart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-card-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-growpoint-accent/20 shadow-lg text-center">
          <CardHeader className="pb-6">
            {/* Logo at the top */}
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
                alt="GrowPoint" 
                className="w-20 h-20 object-contain" 
                style={{ background: 'transparent' }}
              />
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-growpoint-dark mb-2">
              Thank You for Completing the Survey!
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <p className="text-lg text-growpoint-dark/80">
                  Your feedback was submitted anonymously.
                </p>
                <p className="text-base text-growpoint-dark/70">
                  You are helping your team grow stronger every day.
                </p>
              </div>
              
              {/* Motivational Tip Box */}
              <Card className="bg-growpoint-accent/10 border-growpoint-accent/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-growpoint-accent/20 p-2 rounded-full">
                      <Lightbulb className="w-5 h-5 text-growpoint-accent" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-growpoint-dark mb-1">💡 Tip of the Day</h4>
                      <p className="text-sm text-growpoint-dark/80">
                        A small act of kindness can boost team morale.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex items-center justify-center gap-2 text-growpoint-accent">
                <Heart className="w-5 h-5 fill-current" />
                <span className="text-sm font-medium">Thank you for making a difference</span>
              </div>
              
              <div className="pt-4 space-y-3">
                <Button
                  onClick={onRestart}
                  className="w-full text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#FFB4A2' }}
                >
                  <Home className="w-4 h-4" />
                  Return to Home Page
                </Button>
                
                <p className="text-xs text-growpoint-dark/60">
                  Ready to start fresh or share more feedback
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYouScreen;
