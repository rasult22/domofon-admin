import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  DoorOpen, 
  Shield, 
  Users, 
  Settings,
  UserCheck,
  UserX,
  Clock,
  MapPin
} from 'lucide-react';

interface Gate {
  id: string;
  name: string;
  type: 'gate' | 'barrier';
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  total_permissions: number;
  active_permissions: number;
  created: string;
  updated: string;
}

interface Permission {
  id: string;
  gate_id: string;
  resident_name: string;
  apartment_number: string;
  access_type: 'permanent' | 'temporary' | 'visitor';
  valid_from: string;
  valid_until: string;
  status: 'active' | 'expired' | 'revoked';
  created: string;
}

const GateManagement: React.FC = () => {
  const { complex } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGate, setEditingGate] = useState<Gate | null>(null);
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, this would come from React Query
  const [gates] = useState<Gate[]>([
    {
      id: '1',
      name: 'Main Entrance Gate',
      type: 'gate',
      location: 'Building A - Main Entrance',
      status: 'active',
      total_permissions: 156,
      active_permissions: 142,
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Parking Barrier',
      type: 'barrier',
      location: 'Underground Parking',
      status: 'active',
      total_permissions: 89,
      active_permissions: 85,
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-10T14:30:00Z'
    },
    {
      id: '3',
      name: 'Service Gate',
      type: 'gate',
      location: 'Building B - Service Entrance',
      status: 'maintenance',
      total_permissions: 12,
      active_permissions: 0,
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-08T09:15:00Z'
    }
  ]);

  const [permissions] = useState<Permission[]>([
    {
      id: '1',
      gate_id: '1',
      resident_name: 'John Smith',
      apartment_number: '3B',
      access_type: 'permanent',
      valid_from: '2024-01-01T00:00:00Z',
      valid_until: '2024-12-31T23:59:59Z',
      status: 'active',
      created: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      gate_id: '1',
      resident_name: 'Maria Garcia',
      apartment_number: '1A',
      access_type: 'permanent',
      valid_from: '2024-01-01T00:00:00Z',
      valid_until: '2024-12-31T23:59:59Z',
      status: 'active',
      created: '2024-01-10T14:30:00Z'
    },
    {
      id: '3',
      gate_id: '1',
      resident_name: 'Visitor - Jane Doe',
      apartment_number: '2C',
      access_type: 'visitor',
      valid_from: '2024-01-20T09:00:00Z',
      valid_until: '2024-01-20T18:00:00Z',
      status: 'expired',
      created: '2024-01-20T08:00:00Z'
    }
  ]);

  const filteredGates = gates.filter(gate =>
    gate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gate.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGatePermissions = (gateId: string) => {
    return permissions.filter(p => p.gate_id === gateId);
  };

  const handleAddGate = () => {
    setEditingGate(null);
    setShowAddModal(true);
  };

  const handleEditGate = (gate: Gate) => {
    setEditingGate(gate);
    setShowAddModal(true);
  };

  const handleDeleteGate = async (gateId: string) => {
    if (window.confirm('Are you sure you want to delete this gate/barrier?')) {
      setIsLoading(true);
      // In real app, this would be an API call
      setTimeout(() => {
        setIsLoading(false);
        // Remove from state
      }, 1000);
    }
  };

  const handleManagePermissions = (gate: Gate) => {
    setSelectedGate(gate);
    setShowPermissionsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'maintenance': return 'text-orange-600 bg-orange-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'revoked': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAccessTypeColor = (type: string) => {
    switch (type) {
      case 'permanent': return 'text-blue-600 bg-blue-100';
      case 'temporary': return 'text-yellow-600 bg-yellow-100';
      case 'visitor': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gates & Barriers</h1>
          <p className="text-gray-600">
            Manage access points and permissions in {complex?.name || 'your complex'}
          </p>
        </div>
        <Button onClick={handleAddGate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Gate/Barrier
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search gates and barriers by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGates.map((gate) => {
          const Icon = gate.type === 'gate' ? DoorOpen : Shield;
          return (
            <Card key={gate.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-lg">{gate.name}</CardTitle>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    getStatusColor(gate.status)
                  }`}>
                    {gate.status}
                  </span>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {gate.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Permissions</span>
                    <div className="font-semibold">{gate.total_permissions}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Active</span>
                    <div className="font-semibold text-green-600">{gate.active_permissions}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleManagePermissions(gate)}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    Permissions
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditGate(gate)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteGate(gate.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredGates.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <DoorOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No gates or barriers found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first gate or barrier.'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddGate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Gate/Barrier
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingGate ? 'Edit Gate/Barrier' : 'Add New Gate/Barrier'}
              </CardTitle>
              <CardDescription>
                {editingGate ? 'Update gate/barrier information' : 'Add a new access point to your complex'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Main Entrance Gate"
                    defaultValue={editingGate?.name || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={editingGate?.type || 'gate'}
                  >
                    <option value="gate">Gate</option>
                    <option value="barrier">Barrier</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Building A - Main Entrance"
                    defaultValue={editingGate?.location || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={editingGate?.status || 'active'}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button disabled={isLoading}>
                  {isLoading ? 'Saving...' : (editingGate ? 'Update' : 'Add')} Gate/Barrier
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedGate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <CardTitle>Manage Permissions - {selectedGate.name}</CardTitle>
              <CardDescription>
                View and manage access permissions for this gate/barrier
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {getGatePermissions(selectedGate.id).length} total permissions
                  </div>
                  <Button size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Permission
                  </Button>
                </div>

                <div className="space-y-2">
                  {getGatePermissions(selectedGate.id).map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{permission.resident_name}</span>
                          <span className="text-sm text-gray-500">Apt {permission.apartment_number}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            getAccessTypeColor(permission.access_type)
                          }`}>
                            {permission.access_type}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            getStatusColor(permission.status)
                          }`}>
                            {permission.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(permission.valid_from)} - {formatDate(permission.valid_until)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {permission.status === 'active' ? (
                          <Button variant="outline" size="sm" className="text-red-600">
                            <UserX className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="text-green-600">
                            <UserCheck className="h-3 w-3" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setShowPermissionsModal(false)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GateManagement;