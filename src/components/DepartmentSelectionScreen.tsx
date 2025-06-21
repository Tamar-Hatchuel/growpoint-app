import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2, User, IdCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DepartmentSelectionScreenProps {
  onBack: () => void;
  onContinue: (data: { department: string; employee: string; employeeId: string }) => void;
  onNavigateToHR: () => void;
  onNavigateToManager: () => void;
  onNavigateToThankYou: () => void;
}

const DepartmentSelectionScreen: React.FC<DepartmentSelectionScreenProps> = ({ 
  onBack, 
  onContinue, 
  onNavigateToHR, 
  onNavigateToManager, 
  onNavigateToThankYou 
}) => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeeIdError, setEmployeeIdError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch employees when department changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchEmployees(selectedDepartment);
      setSelectedEmployee(''); // Reset employee selection
    }
  }, [selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('Department')
        .not('Department', 'is', null);

      if (error) throw error;

      // Get unique departments
      const uniqueDepartments = [...new Set(data.map(item => item.Department))].filter(Boolean);
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: "Error",
        description: "Failed to load departments. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchEmployees = async (department: string) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('Employee_Name')
        .eq('Department', department)
        .not('Employee_Name', 'is', null);

      if (error) throw error;

      const employeeNames = data.map(item => item.Employee_Name).filter(Boolean);
      setEmployees(employeeNames);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive",
      });
    }
  };

  const validateEmployeeId = (id: string) => {
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
    setEmployeeId(value);
    if (value) {
      validateEmployeeId(value);
    } else {
      setEmployeeIdError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepartment || !selectedEmployee || !employeeId || !validateEmployeeId(employeeId)) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Query to fetch role and verify employee details
      const { data, error } = await supabase
        .from('employees')
        .select('Role')
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

      const userRole = data.Role;
      
      // Store user data for potential use in other screens
      const userData = {
        department: selectedDepartment,
        employee: selectedEmployee,
        employeeId: employeeId,
        role: userRole
      };

      // Role-based navigation
      switch (userRole) {
        case 'HR':
          onNavigateToHR();
          break;
        case 'Manager':
          onNavigateToManager();
          break;
        case 'User':
          onNavigateToThankYou();
          break;
        default:
          // Fallback to continue with survey if role doesn't match expected values
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
              Identify Yourself
            </CardTitle>
            <CardDescription className="text-growpoint-dark/70">
              Help us connect you with your team for personalized insights
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-growpoint-dark font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Select Your Department
                </Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="border-growpoint-accent/30 focus:border-growpoint-primary">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-growpoint-dark font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Select Your Name
                </Label>
                <Select 
                  value={selectedEmployee} 
                  onValueChange={setSelectedEmployee}
                  disabled={!selectedDepartment}
                >
                  <SelectTrigger className="border-growpoint-accent/30 focus:border-growpoint-primary">
                    <SelectValue placeholder={selectedDepartment ? "Select your name" : "Select department first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee} value={employee}>{employee}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-growpoint-dark font-medium flex items-center gap-2">
                  <IdCard className="w-4 h-4" />
                  Enter Your 5-Digit Employee ID
                </Label>
                <Input
                  type="text"
                  placeholder="Enter 5-digit Employee ID"
                  value={employeeId}
                  onChange={handleEmployeeIdChange}
                  className={`border-growpoint-accent/30 focus:border-growpoint-primary ${employeeIdError ? 'border-red-500' : ''}`}
                  maxLength={5}
                  required
                />
                {employeeIdError && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    ❌ {employeeIdError}
                  </p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full bg-growpoint-primary hover:bg-growpoint-accent text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                disabled={!selectedDepartment || !selectedEmployee || !employeeId || !!employeeIdError || isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentSelectionScreen;
