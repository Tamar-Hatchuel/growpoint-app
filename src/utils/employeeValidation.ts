
export const validateEmployeeId = (id: string): { isValid: boolean; error: string } => {
  const regex = /^\d{5}$/;
  if (!regex.test(id)) {
    return {
      isValid: false,
      error: 'Employee ID must be exactly 5 digits'
    };
  }
  return {
    isValid: true,
    error: ''
  };
};
