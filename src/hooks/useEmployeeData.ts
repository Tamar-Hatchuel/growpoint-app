
import { useDepartments } from './useDepartments';
import { useEmployees } from './useEmployees';

export const useEmployeeData = () => {
  const departmentsHook = useDepartments();
  const employeesHook = useEmployees();

  // Provide backward-compatible interface
  const fetchEmployees = (department: string) => {
    employeesHook.fetchEmployees(department);
  };

  const setEmployees = (employees: string[]) => {
    // This is used to reset employees in the original component
    if (employees.length === 0) {
      employeesHook.resetEmployees();
    }
  };

  return {
    departments: departmentsHook.departments,
    employees: employeesHook.employees,
    fetchEmployees,
    setEmployees,
    // Expose loading states for better UX
    departmentsLoading: departmentsHook.loading,
    employeesLoading: employeesHook.loading,
    departmentsError: departmentsHook.error,
    employeesError: employeesHook.error
  };
};
