
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart, Lightbulb, Home } from 'lucide-react';

interface ThankYouScreenProps {
  onRestart: () => void;
}

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ onRestart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-growpoint-accent/20 shadow-lg text-center">
          <CardHeader className="pb-6">
            {/* Logo at the top */}
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
                alt="GrowPoint" 
                className="w-16 h-16 object-contain" 
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
                  Your anonymous feedback helps GrowPoint empower people and accelerate teams.
                </p>
                <p className="text-base text-growpoint-dark/70">
                  We appreciate your contribution to building a stronger workplace.
                </p>
              </div>
              
              {/* Motivational Tip Box */}
              <Card className="bg-growpoint-soft/50 border-growpoint-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-growpoint-primary/10 p-2 rounded-full">
                      <Lightbulb className="w-5 h-5 text-growpoint-primary" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-growpoint-dark mb-1">💡 Tip of the Day</h4>
                      <p className="text-sm text-growpoint-dark/80">
                        A small word of encouragement can spark a big impact.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex items-center justify-center gap-2 text-growpoint-accent">
                <Heart className="w-5 h-5 fill-current" />
                <span className="text-sm font-medium">We appreciate your participation</span>
              </div>
              
              <div className="pt-4 space-y-3">
                <Button
                  onClick={onRestart}
                  className="w-full text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#FFB4A2' }}
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
                
                <p className="text-xs text-growpoint-dark/60">
                  Return to the start to explore again or give more feedback.
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
