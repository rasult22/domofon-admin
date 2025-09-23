import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { pb } from '../queries/client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Mail, Home } from 'lucide-react';

interface Resident {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
}

interface Apartment {
  id: string;
  apartment_number: string;
  apartment_code: string;
  user: string;
  complex_id: string;
}

const ResidentsView: React.FC = () => {
  const { complex } = useAuth();

  // Получаем квартиры текущего ЖК
  const { data: apartments, isLoading: apartmentsLoading } = useQuery({
    queryKey: ['apartments', complex?.id],
    queryFn: async () => {
      if (!complex?.id) return [];
      const records = await pb.collection('apartments').getFullList({
        filter: `complex_id = "${complex.id}"`,
        expand: 'user'
      });
      return records as (Apartment & { expand?: { user: Resident } })[];
    },
    enabled: !!complex?.id
  });

  // Получаем всех жителей (пользователей с квартирами в текущем ЖК)
  const residents = apartments?.filter(apt => apt.expand?.user).map(apt => ({
    ...apt.expand!.user,
    apartment_number: apt.apartment_number
  })) || [];

  if (apartmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка жителей...</div>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Жители</h1>
          <p className="text-gray-600">ЖК: {complex.name}</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Всего: {residents.length}
        </Badge>
      </div>

      {residents.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <User className="mx-auto h-12 w-12 mb-2" />
              <p>Жители не найдены</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {residents.map((resident) => (
            <Card key={resident.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  {resident.name || resident.username}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {resident.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Home className="h-4 w-4" />
                  Квартира: {resident.apartment_number}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResidentsView;