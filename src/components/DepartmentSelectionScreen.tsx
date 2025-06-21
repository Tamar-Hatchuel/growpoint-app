
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2, User, IdCard, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DepartmentSelectionScreenProps {
  onBack: () => void;
  onContinue: (data: { department: string; employee: string; employeeId: string }) => void;
  onNavigateToHR: () => void;
  onNavigateToManager: () => void;
  onNavigateToUser: () => void;
}

const DepartmentSelectionScreen: React.FC<DepartmentSelectionScreenProps> = ({ 
  onBack, 
  onContinue, 
  onNavigateToHR, 
  onNavigateToManager, 
  onNavigateToUser 
}) => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeeIdError, setEmployeeIdError] = useState('');
  const [loading, setLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const { toast } = useToast();

  // Load departments on component mount
  useEffect(() => {
    loadDepartments();
  }, []);

  // Load employees when department changes
  useEffect(() => {
    if (selectedDepartment) {
      loadEmployees(selectedDepartment);
      setSelectedEmployee(''); // Reset employee selection
    } else {
      setEmployees([]);
    }
  }, [selectedDepartment]);

  const loadDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('"Team/Department"')
        .not('"Team/Department"', 'is', null);

      if (error) throw error;

      // Get unique departments
      const uniqueDepartments = [...new Set(data.map(item => item['Team/Department'] as string))];
      setDepartments(uniqueDepartments.filter(Boolean));
    } catch (error) {
      console.error('Error loading departments:', error);
      toast({
        title: "Error",
        description: "Failed to load departments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const loadEmployees = async (department: string) => {
    try {
      setEmployeesLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('Employee Name')
        .eq('"Team/Department"', department)
        .not('Employee Name', 'is', null);

      if (error) throw error;

      const employeeNames = data.map(item => item['Employee Name'] as string).filter(Boolean);
      setEmployees(employeeNames);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive",
      });
    } finally {
      setEmployeesLoading(false);
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
    // Only allow numeric input
    if (value === '' || /^\d+$/.test(value)) {
      setEmployeeId(value);
      if (value) {
        validateEmployeeId(value);
      } else {
        setEmployeeIdError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepartment || !selectedEmployee || !employeeId || !validateEmployeeId(employeeId)) {
      return;
    }

    try {
      setLoading(true);

      // Query Supabase to verify employee and get role
      const { data, error } = await supabase
        .from('employees')
        .select('Role')
        .eq('"Team/Department"', selectedDepartment)
        .eq('Employee Name', selectedEmployee)
        .eq('Employee ID', parseInt(employeeId))
        .single();

      if (error || !data) {
        toast({
          title: "Authentication Failed",
          description: "Invalid employee credentials. Please check your information and try again.",
          variant: "destructive",
        });
        return;
      }

      const userRole = data.Role;

      // Route based on role
      if (userRole === 'HR') {
        onNavigateToHR();
      } else if (userRole === 'Manager') {
        onNavigateToManager();
      } else if (userRole === 'User') {
        onNavigateToUser();
      } else {
        // Fallback - continue with original flow
        onContinue({
          department: selectedDepartment,
          employee: selectedEmployee,
          employeeId: employeeId
        });
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      toast({
        title: "Error",
        description: "An error occurred during authentication. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-growpoint-dark hover:text-growpoint-accent hover:bg-growpoint-soft/50"
          disabled={loading}
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
                  Department
                </Label>
                <Select 
                  value={selectedDepartment} 
                  onValueChange={setSelectedDepartment}
                  disabled={departmentsLoading || loading}
                >
                  <SelectTrigger className="border-growpoint-accent/30 focus:border-growpoint-primary">
                    <SelectValue placeholder={departmentsLoading ? "Loading departments..." : "Select your department"} />
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
                  Employee Name
                </Label>
                <Select 
                  value={selectedEmployee} 
                  onValueChange={setSelectedEmployee}
                  disabled={!selectedDepartment || employeesLoading || loading}
                >
                  <SelectTrigger className="border-growpoint-accent/30 focus:border-growpoint-primary">
                    <SelectValue placeholder={
                      !selectedDepartment 
                        ? "Select department first" 
                        : employeesLoading 
                        ? "Loading employees..." 
                        : "Select your name"
                    } />
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
                  Employee ID
                </Label>
                <Input
                  type="text"
                  placeholder="Enter 5-digit Employee ID"
                  value={employeeId}
                  onChange={handleEmployeeIdChange}
                  className={`border-growpoint-accent/30 focus:border-growpoint-primary ${employeeIdError ? 'border-red-500' : ''}`}
                  maxLength={5}
                  required
                  disabled={loading}
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
                disabled={!selectedDepartment || !selectedEmployee || !employeeId || !!employeeIdError || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Continue to Survey'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentSelectionScreen;
