
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const DepartmentFormLoading: React.FC = () => {
  return (
    <Card className="border-growpoint-accent/20 shadow-lg">
      <CardContent className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-growpoint-primary" />
        <p className="text-growpoint-dark">Loading departments...</p>
      </CardContent>
    </Card>
  );
};

export default DepartmentFormLoading;
