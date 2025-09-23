import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApartmentsWithResidents } from '../queries/apartments';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Mail, Home } from 'lucide-react';

interface Resident {
  id: string;
  name: string;
  email: string;
  username: string;
}

interface Apartment {
  id: string;
  apartment_number: string;
  apartment_code: string;
  user: string;
  complex_id: string;
  expand?: {
    user?: Resident;
  };
}

const ResidentsView: React.FC = () => {
  const { complex } = useAuth();

  // Получаем квартиры текущего ЖК
  const { data: apartments, isLoading: apartmentsLoading } = useApartmentsWithResidents(complex?.id);

  if (apartmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Загрузка жильцов...</p>
        </div>
      </div>
    );
  }

  if (!complex) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Выберите жилой комплекс</p>
      </div>
    );
  }

  // Фильтруем только заселенные квартиры
  const residentsData = apartments?.filter(apt => apt.expand?.user) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Жильцы</h1>
          <p className="text-gray-600">ЖК: {complex.name}</p>
        </div>
        <Badge variant="default" className="text-sm px-3 py-1">
          Всего жильцов: {residentsData.length}
        </Badge>
      </div>

      {residentsData.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <User className="mx-auto h-12 w-12 mb-2" />
              <p>Жильцы не найдены</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {residentsData.map((apartment) => {
            const resident = apartment.expand?.user;
            if (!resident) return null;

            return (
              <Card key={apartment.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {resident.name || resident.username}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {resident.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{resident.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Home className="h-4 w-4" />
                    <span>Кв. {apartment.apartment_number}</span>
                  </div>

                  {apartment.apartment_code && (
                    <div className="text-xs text-gray-500">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        Код: {apartment.apartment_code}
                      </span>
                    </div>
                  )}

                  <div className="text-xs text-gray-400 pt-2 border-t">
                    ID: {resident.id.slice(0, 8)}...
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

export default ResidentsView;