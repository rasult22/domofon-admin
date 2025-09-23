import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGates, useGatePermissions } from '../queries/gates';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { DoorOpen, Car, Users, Phone, User } from 'lucide-react';

const GatesView: React.FC = () => {
  const { complex } = useAuth();

  const { data: gates, isLoading: gatesLoading } = useGates(complex?.id);
  const { data: permissions, isLoading: permissionsLoading } = useGatePermissions(complex?.id);

  const isLoading = gatesLoading || permissionsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка заграждений...</div>
      </div>
    );
  }

  if (!complex) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">ЖК не выбран</div>
      </div>
    );
  }

  const getGateIcon = (type: string) => {
    return type === 'BARRIER' ? Car : DoorOpen;
  };

  const getGateTypeLabel = (type: string) => {
    return type === 'BARRIER' ? 'Шлагбаум' : 'Калитка';
  };

  const getUsersForGate = (gateId: string) => {
    return permissions?.filter(perm => 
      perm.gate_ids.includes(gateId)
    ) || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Калитки и Шлагбаумы</h1>
          <p className="text-gray-600">{complex.name}</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Всего: {gates?.length || 0}
        </Badge>
      </div>

      {!gates || gates.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <DoorOpen className="mx-auto h-12 w-12 mb-2" />
              <p>Заграждения не найдены</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {gates.map((gate) => {
            const Icon = getGateIcon(gate.type);
            const usersWithAccess = getUsersForGate(gate.id);

            return (
              <Card key={gate.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {gate.name}
                        <Badge variant="outline" className="text-xs">
                          {getGateTypeLabel(gate.type)}
                        </Badge>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4" />
                      <span className="font-medium text-sm">
                        Доступы ({usersWithAccess.length})
                      </span>
                    </div>

                    {usersWithAccess.length === 0 ? (
                      <div className="text-sm text-gray-500 italic">
                        Нет пользователей с доступом
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {usersWithAccess.map((permission) => (
                          <div 
                            key={permission.id}
                            className="flex items-center gap-2 text-sm bg-gray-50 rounded p-2"
                          >
                            <User className="h-3 w-3 text-gray-400" />
                            <span>
                              {permission.user_name || 
                               permission.user_email || 
                               'Неизвестный пользователь'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GatesView;