import { Briefcase, Building2, Shield, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const roles = [
  {
    id: 'worker',
    title: 'Worker',
    description: 'Find jobs near you',
    icon: Briefcase,
    color: 'text-chart-1',
  },
  {
    id: 'employer',
    title: 'Employer',
    description: 'Post jobs & hire workers',
    icon: Building2,
    color: 'text-chart-2',
  },
  {
    id: 'ngo',
    title: 'NGO/CSC Partner',
    description: 'Assist worker registration',
    icon: Users,
    color: 'text-chart-4',
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'Platform management',
    icon: Shield,
    color: 'text-chart-3',
  },
];

interface RoleSelectorProps {
  onRoleSelect: (roleId: string) => void;
}

export default function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="p-6 space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Dehadi</h2>
        <p className="text-muted-foreground">Select your role to continue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card
              key={role.id}
              className="hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => onRoleSelect(role.id)}
              data-testid={`role-${role.id}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`p-4 bg-primary/10 rounded-full ${role.color}`}>
                    <Icon size={40} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{role.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
