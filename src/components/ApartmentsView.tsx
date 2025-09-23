import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { pb } from '../queries/client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Home, User, Key, Hash } from 'lucide-react';

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

const ApartmentsView: React.FC = () => {
  const { complex } = useAuth();

  const { data: apartments, isLoading } = useQuery({
    queryKey: ['apartments', complex?.id],
    queryFn: async () => {
      if (!complex?.id) return [];
      const records = await pb.collection('apartments').getFullList({
        filter: `complex_id = "${complex.id}"`,
        expand: 'user',
        sort: '+apartment_number'
      });
      return records as Apartment[];
    },
    enabled: !!complex?.id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка квартир...</div>
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

  const occupiedApartments = apartments?.filter(apt => apt.user) || [];
  const vacantApartments = apartments?.filter(apt => !apt.user) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Квартиры</h1>
          <p className="text-gray-600">ЖК: {complex.name}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default" className="text-sm px-3 py-1">
            Всего: {apartments?.length || 0}
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            Заселено: {occupiedApartments.length}
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">
            Свободно: {vacantApartments.length}
          </Badge>
        </div>
      </div>

      {!apartments || apartments.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <Home className="mx-auto h-12 w-12 mb-2" />
              <p>Квартиры не найдены</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {apartments.map((apartment) => (
            <Card 
              key={apartment.id} 
              className={`hover:shadow-md transition-shadow ${
                apartment.user ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Кв. {apartment.apartment_number}
                  </div>
                  <Badge 
                    variant={apartment.user ? "default" : "outline"}
                    className="text-xs"
                  >
                    {apartment.user ? "Заселена" : "Свободна"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {apartment.apartment_code && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Key className="h-4 w-4" />
                    <span className="font-mono text-xs">
                      {apartment.apartment_code}
                    </span>
                  </div>
                )}
                
                {apartment.expand?.user ? (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="h-4 w-4" />
                    <span className="font-medium">
                      {apartment.expand.user.name || apartment.expand.user.username}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <User className="h-4 w-4" />
                    <span>Не заселена</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Hash className="h-3 w-3" />
                  ID: {apartment.id.slice(0, 8)}...
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApartmentsView;