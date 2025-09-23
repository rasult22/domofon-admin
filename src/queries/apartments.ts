import { useQuery } from '@tanstack/react-query';
import { pb } from './client';


interface Apartment {
  id: string;
  apartment_number: string;
  apartment_code: string;
  user: string;
  complex_id: string;
}

export interface Resident {
  user_id: string;
  user_name: string;
  user_email: string;
}

// Query для получения квартир с жильцами (для ResidentsView)
export const useApartmentsWithResidents = (complexId?: string) => {
  return useQuery({
    queryKey: ['apartments_list', complexId],
    queryFn: async () => {
      if (!complexId) return [];
      const records = await pb.collection('apartment_list').getFullList({
        filter: `complex_id = "${complexId}"`,
      });
      return records as (Apartment & {user_id: string, user_name: string, user_email: string})[];
    },
    enabled: !!complexId
  });
};

// Query для получения квартир (для ApartmentsView)
export const useApartments = (complexId?: string) => {
  return useQuery({
    queryKey: ['apartments', complexId],
    queryFn: async () => {
      if (!complexId) return [];
      const records = await pb.collection('apartment_list').getFullList({
        filter: `complex_id = "${complexId}"`,
        sort: '+apartment_number'
      });
      return records as (Apartment & {user_id: string, user_name: string, user_email: string})[];
    },
    enabled: !!complexId
  });
};

// Query для получения только резидентов (уникальных пользователей)
export const useResidents = (complexId?: string) => {
  return useQuery({
    queryKey: ['residents', complexId],
    queryFn: async () => {
      if (!complexId) return [];
      const records = await pb.collection('apartment_list').getFullList({
        filter: `complex_id = "${complexId}"`,
        sort: '+user_name'
      });
      
      // Извлекаем уникальных резидентов
      const residents = records.reduce((acc, record) => {
        const resident = {
          user_id: record.user_id,
          user_name: record.user_name,
          user_email: record.user_email
        };
        
        // Добавляем только если такого пользователя еще нет
        if (!acc.find(r => r.user_id === resident.user_id)) {
          acc.push(resident);
        }
        
        return acc;
      }, [] as Resident[]);
      
      return residents;
    },
    enabled: !!complexId
  });
};