
import React from 'react';
import { Home, BarChart3, MessageSquare, LogOut } from 'lucide-react';
import { GrowpointButton } from '@/components/ui/growpoint-button';

interface NavigationProps {
  userRole: 'manager' | 'hr';
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  userRole,
  currentView,
  onNavigate,
  onLogout,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'suggestions', label: 'Suggestions', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-growpoint-soft border-b border-growpoint-accent/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-growpoint-dark">
                GrowPoint {userRole === 'hr' ? 'HR' : 'Manager'}
              </h1>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                        currentView === item.id
                          ? "bg-growpoint-primary text-white"
                          : "text-growpoint-dark hover:bg-growpoint-primary/20"
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <GrowpointButton
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </GrowpointButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default Navigation;
