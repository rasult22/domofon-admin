import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApartmentsWithResidents } from '../queries/apartments';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { User, Mail, Home, Search, ArrowUpDown, Copy, Check } from 'lucide-react';

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
  const residentsData = apartments?.filter(apt => apt.user_id !== '') || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'apartment_number' | 'email'>('apartment_number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredAndSortedResidents = useMemo(() => {
    let filtered = residentsData.filter(apartment => {
      const resident = {
        name: apartment.user_name || '',
        email: apartment.user_email || '',
        apartment_number: apartment.apartment_number || ''
      };
      
      const searchLower = searchTerm.toLowerCase();
      return (
        resident.name.toLowerCase().includes(searchLower) ||
        resident.email.toLowerCase().includes(searchLower) ||
        resident.apartment_number.toLowerCase().includes(searchLower)
      );
    });

    return filtered.sort((a, b) => {
      let aValue = '';
      let bValue = '';
      
      switch (sortField) {
        case 'name':
          aValue = a.user_name || '';
          bValue = b.user_name || '';
          break;
        case 'email':
          aValue = a.user_email || '';
          bValue = b.user_email || '';
          break;
        case 'apartment_number':
          aValue = a.apartment_number || '';
          bValue = b.apartment_number || '';
          break;
      }
      
      const comparison = aValue.localeCompare(bValue, 'ru', { numeric: true });
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [residentsData, searchTerm, sortField, sortDirection]);

  const handleSort = (field: 'name' | 'apartment_number' | 'email') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Жильцы</h1>
        </div>
        <Badge variant="default" className="text-sm px-3 py-1">
          Всего жильцов: {residentsData.length}
        </Badge>
      </div>

      {/* Поиск */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск по имени, email или номеру квартиры..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          Найдено: {filteredAndSortedResidents.length}
        </Badge>
      </div>

      {filteredAndSortedResidents.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <User className="mx-auto h-12 w-12 mb-2" />
              <p>{searchTerm ? 'Жильцы не найдены по запросу' : 'Жильцы не найдены'}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('apartment_number')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Квартира
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('name')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Имя
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('email')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Email
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">Код квартиры</th>
                    <th className="text-left p-4 font-medium text-gray-900">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedResidents.map((apartment, index) => {
                    const resident = {
                      id: apartment.user_id,
                      name: apartment.user_name,
                      email: apartment.user_email,
                    };

                    return (
                      <tr
                        key={apartment.id}
                        className={`border-b hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{apartment.apartment_number}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{resident.name || 'Не указано'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{resident.email || 'Не указано'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                           {apartment.apartment_code ? (
                             <div className="flex items-center gap-2">
                               <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                 {apartment.apartment_code}
                               </span>
                               <button
                                  onClick={() => handleCopyCode(apartment.apartment_code)}
                                  className={`p-1 rounded transition-colors ${
                                    copiedCode === apartment.apartment_code
                                      ? 'bg-green-100 text-green-600'
                                      : 'hover:bg-gray-100 text-gray-500'
                                  }`}
                                  title={copiedCode === apartment.apartment_code ? 'Скопировано!' : 'Копировать код'}
                                >
                                  {copiedCode === apartment.apartment_code ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </button>
                             </div>
                           ) : (
                             <span className="text-gray-400 text-sm">Не указан</span>
                           )}
                         </td>
                        <td className="p-4">
                          <span className="text-xs text-gray-400 font-mono">
                            {resident.id.slice(0, 8)}...
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResidentsView;