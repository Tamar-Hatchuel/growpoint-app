
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Target, BarChart3 } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-growpoint-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-growpoint-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-growpoint-dark/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Logo/Brand Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
              alt="GrowPoint" 
              className="w-20 h-20 object-contain"
              style={{ background: 'transparent' }}
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-growpoint-dark mb-4 tracking-tight">
            GrowPoint
          </h1>
          
          <p className="text-xl md:text-2xl text-growpoint-accent font-semibold mb-2">
            Empowering People. Accelerating Teams.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="max-w-4xl w-full mb-12 border-growpoint-accent/20 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in">
          <CardContent className="p-8 md:p-12 text-center">
            <p className="text-lg md:text-xl text-growpoint-dark leading-relaxed">
              "GrowPoint is your team's invisible mirror. Understand real dynamics, 
              improve cohesion, and accelerate team growth — powered by anonymous 
              feedback and AI-driven insights."
            </p>
          </CardContent>
        </Card>

        {/* Feature Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl w-full">
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-growpoint-soft p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-growpoint-dark" />
            </div>
            <h3 className="font-semibold text-growpoint-dark mb-1">Team Dynamics</h3>
            <p className="text-sm text-growpoint-dark/70">Understand real relationships</p>
          </div>
          
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="bg-growpoint-soft p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-growpoint-dark" />
            </div>
            <h3 className="font-semibold text-growpoint-dark mb-1">Anonymous Feedback</h3>
            <p className="text-sm text-growpoint-dark/70">Safe, honest communication</p>
          </div>
          
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="bg-growpoint-soft p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-growpoint-dark" />
            </div>
            <h3 className="font-semibold text-growpoint-dark mb-1">AI Insights</h3>
            <p className="text-sm text-growpoint-dark/70">Data-driven growth</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="animate-scale-in" style={{ animationDelay: '0.8s' }}>
          <Button
            onClick={onStart}
            className="bg-growpoint-primary hover:bg-growpoint-accent text-white font-bold text-lg px-12 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Start Your Survey
          </Button>
        </div>

        {/* Subtitle */}
        <p className="text-growpoint-dark/60 text-center mt-6 max-w-md animate-fade-in" style={{ animationDelay: '1s' }}>
          Join teams worldwide in building stronger, more effective collaboration
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
