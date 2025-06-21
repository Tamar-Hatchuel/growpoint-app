
import { useState, useEffect } from 'react';

export const useDepartmentForm = (fetchEmployees: (department: string) => Promise<void>, setEmployees: (employees: string[]) => void) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeeIdError, setEmployeeIdError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedDepartment) {
      fetchEmployees(selectedDepartment);
      setSelectedEmployee('');
    } else {
      setEmployees([]);
    }
  }, [selectedDepartment, fetchEmployees, setEmployees]);

  const validateEmployeeId = (id: string): boolean => {
    const regex = /^\d{5}$/;
    if (!regex.test(id)) {
      setEmployeeIdError('Employee ID must be exactly 5 digits');
      return false;
    }
    setEmployeeIdError('');
    return true;
  };

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setEmployeeId(value);
      if (value) {
        validateEmployeeId(value);
      } else {
        setEmployeeIdError('');
      }
    }
  };

  return {
    selectedDepartment,
    setSelectedDepartment,
    selectedEmployee,
    setSelectedEmployee,
    employeeId,
    employeeIdError,
    submitting,
    setSubmitting,
    validateEmployeeId,
    handleEmployeeIdChange
  };
};
