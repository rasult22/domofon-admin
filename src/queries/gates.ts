import { useQuery } from '@tanstack/react-query';
import { pb } from './client';

export interface Gate {
  id: string;
  type: string;
  name: string;
  complex_id: string;
}

export interface GatePermission {
  id: string;
  gate_ids: string[];
  user_id: string;
  user_name: string;
  user_email: string;
  complex_id: string;
}

// Query для получения ворот
export const useGates = (complexId?: string) => {
  return useQuery({
    queryKey: ['gates', complexId],
    queryFn: async () => {
      if (!complexId) return [];
      const records = await pb.collection('gates').getFullList({
        filter: `complex_id = "${complexId}"`,
        sort: '+name'
      });
      return records as Gate[];
    },
    enabled: !!complexId
  });
};

// Query для получения разрешений ворот
export const useGatePermissions = (complexId?: string) => {
  return useQuery({
    queryKey: ['gate_permissions', complexId],
    queryFn: async () => {
      if (!complexId) return [];
      const records = await pb.collection('gates_user_permissions_view').getFullList({
        filter: `complex_id = "${complexId}"`,
        sort: '+user_id'
      });
      return records as GatePermission[];
    },
    enabled: !!complexId
  });
};