
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthenticateUserParams {
  selectedDepartment: string;
  selectedEmployee: string;
  employeeId: string;
  onContinue: (userData: any) => void;
  onNavigateToHRChoice: (userData: any) => void;
  onNavigateToAdminChoice: (userData: any) => void;
}

export const useEmployeeAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const authenticateUser = async ({
    selectedDepartment,
    selectedEmployee,
    employeeId,
    onContinue,
    onNavigateToHRChoice,
    onNavigateToAdminChoice
  }: AuthenticateUserParams) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('Permission, Department')
        .eq('Department', selectedDepartment)
        .eq('Employee_Name', selectedEmployee)
        .eq('Employee ID', parseInt(employeeId))
        .single();

      if (error || !data) {
        toast({
          title: "Authentication Failed",
          description: "Invalid employee details. Please check your information and try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const userPermission = data.Permission;
      const userDepartment = data.Department;
      
      const userData = {
        department: selectedDepartment,
        employee: selectedEmployee,
        employeeId: employeeId,
        permission: userPermission,
        userDepartment: userDepartment
      };

      console.log('User authenticated with permission:', userPermission);

      switch (userPermission) {
        case 'user':
          onContinue(userData);
          break;
        case 'HR':
          onNavigateToHRChoice(userData);
          break;
        case 'Admin':
          onNavigateToAdminChoice(userData);
          break;
        default:
          onContinue(userData);
      }

    } catch (error) {
      console.error('Error authenticating user:', error);
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    authenticateUser,
    isLoading
  };
};
