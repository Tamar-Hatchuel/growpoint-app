
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BarChart3, TrendingUp, Shield } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
            alt="GrowPoint" 
            className="w-24 h-24 md:w-32 md:h-32 object-contain" 
            style={{ background: 'transparent' }}
          />
        </div>
        
        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-growpoint-dark mb-4">
            Welcome to GrowPoint
          </h1>
          <p className="text-lg md:text-xl text-growpoint-dark/80 max-w-2xl mx-auto leading-relaxed">
            Empowering people and accelerating teams through anonymous feedback and data-driven insights
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          <Card className="border-growpoint-accent/20 hover:shadow-md transition-shadow">
            <CardHeader className="text-center pb-4">
              <Users className="w-8 h-8 text-growpoint-primary mx-auto mb-2" />
              <CardTitle className="text-base md:text-lg text-growpoint-dark">Anonymous Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-sm">
                Share honest feedback without fear of judgment
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20 hover:shadow-md transition-shadow">
            <CardHeader className="text-center pb-4">
              <BarChart3 className="w-8 h-8 text-growpoint-primary mx-auto mb-2" />
              <CardTitle className="text-base md:text-lg text-growpoint-dark">Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-sm">
                Track team dynamics and engagement trends
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20 hover:shadow-md transition-shadow">
            <CardHeader className="text-center pb-4">
              <TrendingUp className="w-8 h-8 text-growpoint-primary mx-auto mb-2" />
              <CardTitle className="text-base md:text-lg text-growpoint-dark">Growth Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-sm">
                Identify opportunities for team improvement
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20 hover:shadow-md transition-shadow">
            <CardHeader className="text-center pb-4">
              <Shield className="w-8 h-8 text-growpoint-primary mx-auto mb-2" />
              <CardTitle className="text-base md:text-lg text-growpoint-dark">Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-sm">
                Your responses are completely anonymous and secure
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button
            onClick={onStart}
            className="bg-growpoint-primary hover:bg-growpoint-accent text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-200 transform hover:scale-105 min-h-[48px]"
          >
            Get Started
          </Button>
          <p className="text-sm text-growpoint-dark/60 mt-4">
            Takes only 2-3 minutes to complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
