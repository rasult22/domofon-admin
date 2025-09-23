import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApartments } from '../queries/apartments';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Home, User, Key, Hash, Search, ArrowUpDown, Copy, Check } from 'lucide-react';

const ApartmentsView: React.FC = () => {
  const { complex } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'apartment_number' | 'user_name' | 'status'>('apartment_number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: apartments, isLoading } = useApartments(complex?.id);

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

  const occupiedApartments = apartments?.filter(apt => apt.user_id) || [];
  const vacantApartments = apartments?.filter(apt => !apt.user_id) || [];

  const filteredAndSortedApartments = useMemo(() => {
    if (!apartments) return [];

    let filtered = apartments.filter(apartment => {
      const searchLower = searchTerm.toLowerCase();
      return (
        apartment.apartment_number.toString().includes(searchLower) ||
        (apartment.user_name && apartment.user_name.toLowerCase().includes(searchLower)) ||
        (apartment.user_email && apartment.user_email.toLowerCase().includes(searchLower)) ||
        (apartment.apartment_code && apartment.apartment_code.toLowerCase().includes(searchLower))
      );
    });

    return filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'apartment_number':
          aValue = parseInt(a.apartment_number);
          bValue = parseInt(b.apartment_number);
          break;
        case 'user_name':
          aValue = a.user_name || a.user_email || '';
          bValue = b.user_name || b.user_email || '';
          break;
        case 'status':
          aValue = a.user_id ? 'occupied' : 'vacant';
          bValue = b.user_id ? 'occupied' : 'vacant';
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [apartments, searchTerm, sortField, sortDirection]);

  const handleSort = (field: 'apartment_number' | 'user_name' | 'status') => {
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
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Квартиры</h1>
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

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Поиск по номеру квартиры, жильцу или коду..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {!apartments || apartments.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <Home className="mx-auto h-12 w-12 mb-2" />
            <p>Квартиры не найдены</p>
          </div>
        </div>
      ) : filteredAndSortedApartments.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <Search className="mx-auto h-12 w-12 mb-2" />
            <p>Квартиры по запросу не найдены</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold text-gray-900 hover:text-gray-700"
                      onClick={() => handleSort('apartment_number')}
                    >
                      Квартира
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="font-semibold text-gray-900">Код квартиры</span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold text-gray-900 hover:text-gray-700"
                      onClick={() => handleSort('user_name')}
                    >
                      Жилец
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold text-gray-900 hover:text-gray-700"
                      onClick={() => handleSort('status')}
                    >
                      Статус
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="font-semibold text-gray-900">ID</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedApartments.map((apartment) => (
                  <tr key={apartment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Кв. {apartment.apartment_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {apartment.apartment_code ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {apartment.apartment_code}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 p-0 transition-colors ${
                              copiedCode === apartment.apartment_code
                                ? 'text-green-600 hover:text-green-700'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                            onClick={() => handleCopyCode(apartment.apartment_code!)}
                            title={copiedCode === apartment.apartment_code ? 'Скопировано!' : 'Копировать код'}
                          >
                            {copiedCode === apartment.apartment_code ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {apartment.user_id ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {apartment.user_name || apartment.user_email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Не заселена</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={apartment.user_id ? "default" : "outline"}
                        className="text-xs"
                      >
                        {apartment.user_id ? "Заселена" : "Свободна"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Hash className="h-3 w-3" />
                        <span className="font-mono">{apartment.id.slice(0, 8)}...</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentsView;