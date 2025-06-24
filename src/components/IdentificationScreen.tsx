
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Users } from 'lucide-react';

interface IdentificationScreenProps {
  onBack: () => void;
  onContinue: (data: { name: string; team: string }) => void;
}

const IdentificationScreen: React.FC<IdentificationScreenProps> = ({ onBack, onContinue }) => {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [errors, setErrors] = useState<{ name?: string; team?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; team?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!team.trim()) {
      newErrors.team = 'Team name is required';
    } else if (team.trim().length < 2) {
      newErrors.team = 'Team name must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onContinue({ name: name.trim(), team: team.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-growpoint-dark hover:text-growpoint-accent hover:bg-growpoint-soft/50 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Welcome
        </Button>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
            alt="GrowPoint" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain" 
            style={{ background: 'transparent' }}
          />
        </div>
        
        <Card className="border-growpoint-accent/20 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl md:text-2xl font-bold text-growpoint-dark">
              Let's Get Started
            </CardTitle>
            <CardDescription className="text-growpoint-dark/70">
              Tell us a bit about yourself to personalize your experience
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label 
                  htmlFor="name" 
                  className="text-growpoint-dark font-medium flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Your Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors(prev => ({ ...prev, name: undefined }));
                    }
                  }}
                  className={`border-growpoint-accent/30 focus:border-growpoint-primary focus:ring-growpoint-primary/20 min-h-[44px] ${
                    errors.name ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="team" 
                  className="text-growpoint-dark font-medium flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Team Name
                </Label>
                <Input
                  id="team"
                  type="text"
                  placeholder="Enter your team name"
                  value={team}
                  onChange={(e) => {
                    setTeam(e.target.value);
                    if (errors.team) {
                      setErrors(prev => ({ ...prev, team: undefined }));
                    }
                  }}
                  className={`border-growpoint-accent/30 focus:border-growpoint-primary focus:ring-growpoint-primary/20 min-h-[44px] ${
                    errors.team ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  required
                />
                {errors.team && (
                  <p className="text-sm text-red-600">{errors.team}</p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full bg-growpoint-primary hover:bg-growpoint-accent text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] min-h-[48px]"
                disabled={!name.trim() || !team.trim()}
              >
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IdentificationScreen;
