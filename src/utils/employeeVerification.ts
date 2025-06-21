
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EmployeeVerificationData {
  department: string;
  employee: string;
  employeeId: string;
  role: string;
}

export const verifyEmployee = async (
  selectedDepartment: string,
  selectedEmployee: string,
  employeeId: string
): Promise<EmployeeVerificationData | null> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('Role')
      .eq('"Team/Department"', selectedDepartment)
      .eq('"Employee Name"', selectedEmployee)
      .eq('"Employee ID"', parseInt(employeeId))
      .single();

    if (error || !data) {
      toast.error("No matching employee found. Please check your details.");
      return null;
    }

    return {
      department: selectedDepartment,
      employee: selectedEmployee,
      employeeId: employeeId,
      role: data.Role
    };

  } catch (error) {
    console.error('Error verifying employee:', error);
    toast.error("Failed to verify employee details. Please try again.");
    return null;
  }
};
