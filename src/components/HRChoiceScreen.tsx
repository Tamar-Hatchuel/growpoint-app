import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ClipboardList, BarChart3, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
interface HRChoiceScreenProps {
  onBack: () => void;
  onFillQuestionnaire: (userData: any) => void;
  onViewDashboard: () => void;
  userData: any;
}
const HRChoiceScreen: React.FC<HRChoiceScreenProps> = ({
  onBack,
  onFillQuestionnaire,
  onViewDashboard,
  userData
}) => {
  const {
    toast
  } = useToast();
  const handleLogOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You've been signed out of your account."
      });
      // Navigate to the landing page
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          
          
          <Button variant="outline" onClick={handleLogOut} className="text-growpoint-dark hover:text-growpoint-accent hover:bg-growpoint-soft/50">
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
        
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
            <Button onClick={() => onFillQuestionnaire(userData)} className="w-full bg-growpoint-primary hover:bg-growpoint-accent text-white font-semibold py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-3">
              <ClipboardList className="w-5 h-5" />
              Fill out questionnaire
            </Button>
            
            <Button onClick={onViewDashboard} variant="outline" className="w-full border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft font-semibold py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-3">
              <BarChart3 className="w-5 h-5" />
              View full dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default HRChoiceScreen;