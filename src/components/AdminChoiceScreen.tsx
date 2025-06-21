
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ClipboardList, Building2 } from 'lucide-react';

interface AdminChoiceScreenProps {
  onBack: () => void;
  onFillQuestionnaire: (userData: any) => void;
  onViewDashboard: () => void;
  userData: any;
}

const AdminChoiceScreen: React.FC<AdminChoiceScreenProps> = ({ 
  onBack, 
  onFillQuestionnaire, 
  onViewDashboard,
  userData 
}) => {
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
        
        <Card className="border-growpoint-accent/20 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-growpoint-dark">
              Welcome, {userData?.employee}!
            </CardTitle>
            <CardDescription className="text-growpoint-dark/70">
              What would you like to do today?
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button
              onClick={() => onFillQuestionnaire(userData)}
              className="w-full bg-growpoint-primary hover:bg-growpoint-accent text-white font-semibold py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <ClipboardList className="w-5 h-5" />
              Fill out questionnaire
            </Button>
            
            <Button
              onClick={onViewDashboard}
              variant="outline"
              className="w-full border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft font-semibold py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <Building2 className="w-5 h-5" />
              View department dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminChoiceScreen;
