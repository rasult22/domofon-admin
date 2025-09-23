import { useQuery } from '@tanstack/react-query';
import { pb } from './client';

interface Gate {
  id: string;
  type: string;
  name: string;
  complex_id: string;
  expand?: {
    gates_call_info_via_gate_id?: {
      sim_number: string;
    }[];
  };
}

interface GatePermission {
  id: string;
  gate_ids: string[];
  user_id: string;
  complex_id: string;
  expand?: {
    user_id?: {
      id: string;
      name: string;
      email: string;
      username: string;
    };
  };
}

// Query для получения ворот
export const useGates = (complexId?: string) => {
  return useQuery({
    queryKey: ['gates', complexId],
    queryFn: async () => {
      if (!complexId) return [];
      const records = await pb.collection('gates').getFullList({
        filter: `complex_id = "${complexId}"`,
        expand: 'gates_call_info_via_gate_id',
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
      const records = await pb.collection('gates_user_permissions').getFullList({
        filter: `complex_id = "${complexId}"`,
        expand: 'user_id',
        sort: '+user_id'
      });
      return records as GatePermission[];
    },
    enabled: !!complexId
  });
};