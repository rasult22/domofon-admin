import { useQuery } from '@tanstack/react-query';
import { pb } from './client';


interface Apartment {
  id: string;
  apartment_number: string;
  apartment_code: string;
  user: string;
  complex_id: string;
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