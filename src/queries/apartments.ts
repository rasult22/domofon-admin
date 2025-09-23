import { useQuery } from '@tanstack/react-query';
import { pb } from './client';

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

// Query для получения квартир с жильцами (для ResidentsView)
export const useApartmentsWithResidents = (complexId?: string) => {
  return useQuery({
    queryKey: ['apartments', complexId],
    queryFn: async () => {
      if (!complexId) return [];
      const records = await pb.collection('apartments').getFullList({
        filter: `complex_id = "${complexId}"`,
        expand: 'user'
      });
      return records as (Apartment & { expand?: { user: Resident } })[];
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
      const records = await pb.collection('apartments').getFullList({
        filter: `complex_id = "${complexId}"`,
        expand: 'user',
        sort: '+apartment_number'
      });
      return records as Apartment[];
    },
    enabled: !!complexId
  });
};