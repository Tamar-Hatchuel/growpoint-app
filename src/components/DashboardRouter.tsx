
import React from 'react';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import HRDashboard from './dashboards/HRDashboard';

interface DashboardRouterProps {
  userRole: 'employee' | 'manager' | 'hr';
  userData: {
    name?: string;
    department?: string;
    employeeId?: string;
  };
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ userRole, userData }) => {
  switch (userRole) {
    case 'employee':
      return <EmployeeDashboard userData={userData} />;
    case 'manager':
      return <ManagerDashboard userData={userData} />;
    case 'hr':
      return <HRDashboard userData={userData} />;
    default:
      return <EmployeeDashboard userData={userData} />;
  }
};

export default DashboardRouter;
