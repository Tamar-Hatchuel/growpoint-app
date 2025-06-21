
import { supabase } from '@/integrations/supabase/client';

export interface EmployeeVerificationData {
  department: string;
  employee: string;
  employeeId: string;
  role: string;
}

export interface EmployeeVerificationResult {
  success: boolean;
  data?: EmployeeVerificationData;
  error?: string;
}

export const verifyEmployee = async (
  selectedDepartment: string,
  selectedEmployee: string,
  employeeId: string
): Promise<EmployeeVerificationResult> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('Role')
      .eq('"Team/Department"', selectedDepartment)
      .eq('"Employee Name"', selectedEmployee)
      .eq('"Employee ID"', parseInt(employeeId))
      .single();

    if (error || !data) {
      console.error('Employee verification failed:', error);
      return {
        success: false,
        error: "No matching employee found. Please check your details."
      };
    }

    return {
      success: true,
      data: {
        department: selectedDepartment,
        employee: selectedEmployee,
        employeeId: employeeId,
        role: data.Role
      }
    };

  } catch (error) {
    console.error('Error verifying employee:', error);
    return {
      success: false,
      error: "Failed to verify employee details. Please try again."
    };
  }
};
