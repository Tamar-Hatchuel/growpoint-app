
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2, User, IdCard, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DepartmentSelectionScreenProps {
  onBack: () => void;
  onContinue: (data: { department: string; employee: string; employeeId: string; role: string }) => void;
}

const DepartmentSelectionScreen: React.FC<DepartmentSelectionScreenProps> = ({ onBack, onContinue }) => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeeIdError, setEmployeeIdError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
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
    } else {
      setEmployees([]);
    }
  }, [selectedDepartment]);

  const fetchDepartments = async () => {
    console.log('🔍 Starting fetchDepartments...');
    setLoading(true);
    setFetchError(null);
    
    try {
      console.log('📡 Making Supabase query for departments...');
      const { data, error } = await supabase
        .from('employees')
        .select('Team/Department')
        .not('Team/Department', 'is', null);

      console.log('📊 Raw Supabase response:', { data, error });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      if (!data) {
        console.warn('⚠️ No data returned from Supabase');
        setDepartments([]);
        setFetchError('No data found');
        return;
      }

      console.log(`📝 Processing ${data.length} records...`);
      
      // Get unique departments and filter out null/empty values
      const allDepartments = data.map(item => item['Team/Department']).filter(Boolean);
      console.log('🏢 All departments (before unique):', allDepartments);
      
      const uniqueDepartments = [...new Set(allDepartments)];
      console.log('🎯 Unique departments:', uniqueDepartments);
      
      setDepartments(uniqueDepartments);
      
      if (uniqueDepartments.length === 0) {
        setFetchError('No departments found in database');
        console.warn('⚠️ No departments found after processing');
      } else {
        console.log(`✅ Successfully loaded ${uniqueDepartments.length} departments`);
      }
      
    } catch (error) {
      console.error('💥 Error in fetchDepartments:', error);
      setFetchError(`Failed to load departments: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: "Error",
        description: "Failed to load departments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('🏁 fetchDepartments completed, loading set to false');
    }
  };

  const fetchEmployees = async (department: string) => {
    console.log(`👥 Fetching employees for department: ${department}`);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('Employee Name')
        .eq('Team/Department', department)
        .not('Employee Name', 'is', null);

      console.log(`📊 Employees query result:`, { data, error });

      if (error) throw error;

      const employeeNames = data?.map(item => item['Employee Name']).filter(Boolean) || [];
      console.log(`👤 Found ${employeeNames.length} employees:`, employeeNames);
      setEmployees(employeeNames);
    } catch (error) {
      console.error('💥 Error fetching employees:', error);
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
    // Only allow digits
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

    setSubmitting(true);

    try {
      // Query Supabase to find the user and get their role
      const { data, error } = await supabase
        .from('employees')
        .select('Role')
        .eq('Team/Department', selectedDepartment)
        .eq('Employee Name', selectedEmployee)
        .eq('Employee ID', parseInt(employeeId))
        .single();

      if (error || !data) {
        toast({
          title: "Invalid Credentials",
          description: "No matching employee found. Please check your details.",
          variant: "destructive",
        });
        return;
      }

      // Successfully found user, proceed with their role
      onContinue({
        department: selectedDepartment,
        employee: selectedEmployee,
        employeeId: employeeId,
        role: data.Role
      });

    } catch (error) {
      console.error('Error verifying employee:', error);
      toast({
        title: "Error",
        description: "Failed to verify employee details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Debug render state
  console.log('🎨 Render state:', { 
    loading, 
    departmentsCount: departments.length, 
    departments, 
    fetchError,
    selectedDepartment 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
        <Card className="border-growpoint-accent/20 shadow-lg">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-growpoint-primary" />
            <p className="text-growpoint-dark">Loading departments...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            {fetchError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{fetchError}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchDepartments}
                  className="ml-auto text-red-700 hover:text-red-800"
                >
                  Retry
                </Button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-growpoint-dark font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Department
                  <span className="text-xs text-gray-500">({departments.length} available)</span>
                </Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="border-growpoint-accent/30 focus:border-growpoint-primary bg-white">
                    <SelectValue placeholder={
                      departments.length === 0 
                        ? "No departments found" 
                        : "Select your department"
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
                    {departments.length === 0 ? (
                      <div className="p-3 text-center text-gray-500">
                        No departments available
                      </div>
                    ) : (
                      departments.map((dept) => (
                        <SelectItem key={dept} value={dept} className="hover:bg-gray-50">
                          {dept}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {departments.length === 0 && !loading && (
                  <p className="text-xs text-gray-500">
                    Debug: {departments.length} departments loaded
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-growpoint-dark font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Employee Name
                </Label>
                <Select 
                  value={selectedEmployee} 
                  onValueChange={setSelectedEmployee}
                  disabled={!selectedDepartment}
                >
                  <SelectTrigger className="border-growpoint-accent/30 focus:border-growpoint-primary bg-white">
                    <SelectValue placeholder={selectedDepartment ? "Select your name" : "Select department first"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
                    {employees.map((employee) => (
                      <SelectItem key={employee} value={employee} className="hover:bg-gray-50">
                        {employee}
                      </SelectItem>
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
                disabled={!selectedDepartment || !selectedEmployee || !employeeId || !!employeeIdError || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Continue'
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
