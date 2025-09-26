import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGates, useGatePermissions, Gate, GatePermission } from '../queries/gates';
import { Resident, useResidents } from '../queries/apartments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  DoorOpen, 
  Car, 
  Users, 
  User, 
  Plus, 
  Search, 
  UserX 
} from 'lucide-react';
import { pb } from '@/queries';

const GatesView: React.FC = () => {
  const { complex } = useAuth();
  const [selectedGate, setSelectedGate] = useState<Gate>();
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const { data: gates, isLoading: gatesLoading } = useGates(complex?.id);
  const { data: permissions, isLoading: permissionsLoading, refetch: refetchPermissions } = useGatePermissions(complex?.id);
  const { data: residents, isLoading: residentsLoading } = useResidents(complex?.id);

  const isLoading = gatesLoading || permissionsLoading || residentsLoading;

  // Используем реальные данные из API

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
  const grantAccess = async (resident: Resident, gate: Gate) => {
    // check if user have gates_user_permissions record specified with his id
    try {
      const user_permission = await pb.collection('gates_user_permissions').getFirstListItem<GatePermission>(`user_id="${resident.user_id}"`);
      console.log('User permission found:', user_permission);
      // Handle case when permission exists
      const gate_id = [...user_permission.gate_ids, gate.id];

      await pb.collection('gates_user_permissions').update(user_permission.id, {
        gate_ids: gate_id
      });
      await refetchPermissions()
    } catch (error: any) {
      if (error.status === 404) {
        console.log('No permission record found for user - this is expected for new users');
        // Handle case when no permission exists (create new permission, etc.)
        await pb.collection('gates_user_permissions').create({
          gate_ids: [gate.id],
          user_id: resident.user_id,
          user_name: resident.user_name,
          user_email: resident.user_email,
          complex_id: complex.id
        });
        await refetchPermissions()
      } else {
        console.log('Error granting access:', error);
        // Handle other errors
      }
    }
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

  const getGatePermissions = (gateId: string) => {
    return permissions?.filter(p => p.gate_ids.includes(gateId)) || [];
  };

  const handleManagePermissions = (gate: Gate) => {
    setSelectedGate(gate);
    setShowPermissionsModal(true);
  };

  // Получаем всех резидентов с информацией о доступе к выбранному заграждению
  const filteredResidents = selectedGate && residents ? 
    residents.filter(resident =>
      resident.user_name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      resident.user_email.toLowerCase().includes(userSearchTerm.toLowerCase())
    ).map(resident => {
      const hasAccess = permissions?.some(perm => 
        perm.user_id === resident.user_id && perm.gate_ids.includes(selectedGate.id)
      );
      return {
        ...resident,
        hasAccess
      };
    }) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Калитки и Шлагбаумы</h1>
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
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="font-medium text-sm">
                          Доступы ({usersWithAccess.length})
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManagePermissions(gate)}
                        className="text-xs"
                      >
                        Управление
                      </Button>
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

      {/* Permissions Modal */}
      {showPermissionsModal && selectedGate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <CardTitle>Управление доступами - {selectedGate.name}</CardTitle>
              <CardDescription>
                Просмотр и управление доступами для этого заграждения
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {residents?.length || 0} резидентов • {getGatePermissions(selectedGate.id).length} с доступом
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Поиск по пользователям..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>

                  </div>
                </div>

                <div className="space-y-2">
                  {filteredResidents.map((resident) => (
                    <div key={resident.user_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{resident.user_name}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            resident.hasAccess 
                              ? 'text-green-600 bg-green-100' 
                              : 'text-gray-600 bg-gray-100'
                          }`}>
                            {resident.hasAccess ? 'Есть доступ' : 'Нет доступа'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <span>{resident.user_email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {resident.hasAccess ? (
                          <Button variant="outline" size="sm" className="text-red-600">
                            <UserX className="h-3 w-3 mr-1" />
                            Убрать доступ
                          </Button>
                        ) : (
                          <Button onClick={() => grantAccess(resident, selectedGate)} variant="outline" size="sm" className="text-green-600">
                            <Plus className="h-3 w-3 mr-1" />
                            Дать доступ
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredResidents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {userSearchTerm ? 'Резиденты не найдены' : 'Нет резидентов в ЖК'}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setShowPermissionsModal(false)}>
                  Закрыть
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GatesView;