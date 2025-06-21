
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Heart, TrendingUp, AlertTriangle } from 'lucide-react';

interface OutcomeFocusScreenProps {
  onBack: () => void;
  onContinue: (focus: string) => void;
}

const focusOptions = [
  {
    id: 'maintain',
    title: 'Maintain Chemistry',
    description: 'Keep the positive team dynamics',
    subDescription: 'Preserve what\'s working well',
    color: 'bg-[#FFCDB2]',
    borderColor: 'border-[#FFCDB2]',
    hoverColor: 'hover:bg-[#FFCDB2]/80',
    icon: Heart,
    iconColor: 'text-[#B5828C]'
  },
  {
    id: 'improve',
    title: 'Improve Cohesion',
    description: 'Strengthen team collaboration',
    subDescription: 'Build better connections',
    color: 'bg-[#E5989B]',
    borderColor: 'border-[#E5989B]',
    hoverColor: 'hover:bg-[#E5989B]/80',
    icon: TrendingUp,
    iconColor: 'text-white'
  },
  {
    id: 'resolve',
    title: 'Address Friction',
    description: 'Resolve team conflicts',
    subDescription: 'Tackle challenging issues',
    color: 'bg-[#B5828C]',
    borderColor: 'border-[#B5828C]',
    hoverColor: 'hover:bg-[#B5828C]/80',
    icon: AlertTriangle,
    iconColor: 'text-white'
  }
];

const OutcomeFocusScreen: React.FC<OutcomeFocusScreenProps> = ({ onBack, onContinue }) => {
  const [selectedFocus, setSelectedFocus] = useState<string>('');

  const handleContinue = () => {
    if (selectedFocus) {
      onContinue(selectedFocus);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-growpoint-dark hover:text-growpoint-accent hover:bg-growpoint-soft/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Card className="border-growpoint-accent/20 shadow-lg mb-6">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-growpoint-dark">
              Choose Your Focus
            </CardTitle>
            <CardDescription className="text-lg text-growpoint-dark/70">
              What would you like to prioritize for your team?
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {focusOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedFocus(option.id)}
                    className={`cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                      selectedFocus === option.id ? 'scale-105' : ''
                    }`}
                  >
                    <Card className={`border-2 transition-all duration-200 ${
                      selectedFocus === option.id 
                        ? `${option.borderColor} shadow-xl` 
                        : 'border-growpoint-accent/20 hover:border-growpoint-accent/40'
                    }`}>
                      <CardContent className="p-6 text-center">
                        <div className={`${option.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-colors duration-200 ${option.hoverColor}`}>
                          <IconComponent className={`w-8 h-8 ${option.iconColor}`} />
                        </div>
                        <h3 className="text-xl font-bold text-growpoint-dark mb-2">
                          {option.title}
                        </h3>
                        <p className="text-growpoint-dark/80 mb-1">
                          {option.description}
                        </p>
                        <p className="text-sm text-growpoint-dark/60">
                          {option.subDescription}
                        </p>
                        <div className="mt-4">
                          <Button
                            variant={selectedFocus === option.id ? "default" : "outline"}
                            size="sm"
                            className={selectedFocus === option.id 
                              ? "bg-growpoint-primary hover:bg-growpoint-accent text-white" 
                              : "border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft"
                            }
                          >
                            {selectedFocus === option.id ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-growpoint-accent/20 p-4 md:relative md:bg-transparent md:border-t-0 md:backdrop-blur-none">
          <div className="max-w-4xl mx-auto flex justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={handleContinue}
              disabled={!selectedFocus}
              className="bg-growpoint-primary hover:bg-growpoint-accent text-white font-semibold"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutcomeFocusScreen;
