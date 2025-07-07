
import React from 'react';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import HRDashboard from './dashboards/HRDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

interface DashboardRouterProps {
  userRole: 'employee' | 'manager' | 'hr' | 'admin';
  userData: {
    name?: string;
    department?: string;
    employeeId?: string;
    userDepartment?: string;
  };
  onBackToRoleSelection?: () => void;
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ 
  userRole, 
  userData, 
  onBackToRoleSelection 
}) => {
  switch (userRole) {
    case 'employee':
      return <EmployeeDashboard userData={userData} />;
    case 'manager':
      return <ManagerDashboard userData={userData} />;
    case 'hr':
      return <HRDashboard userData={userData} onBackToRoleSelection={onBackToRoleSelection} />;
    case 'admin':
      return <AdminDashboard userData={userData} onBackToRoleSelection={onBackToRoleSelection} />;
    default:
      return <EmployeeDashboard userData={userData} />;
  }
};

export default DashboardRouter;
