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
  UserPlus, 
  Building,
  Phone,
  Mail
} from 'lucide-react';

interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  apartment_number: string;
  apartment_id: string;
  created: string;
  updated: string;
}

interface Apartment {
  id: string;
  number: string;
  floor: number;
  building: string;
}

const ResidentsManagement: React.FC = () => {
  const { complex } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, this would come from React Query
  const [residents] = useState<Resident[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1234567890',
      apartment_number: '3B',
      apartment_id: 'apt1',
      created: '2024-01-15T10:00:00Z',
      updated: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1234567891',
      apartment_number: '1A',
      apartment_id: 'apt2',
      created: '2024-01-10T14:30:00Z',
      updated: '2024-01-10T14:30:00Z'
    },
    {
      id: '3',
      name: 'David Johnson',
      email: 'david.johnson@email.com',
      phone: '+1234567892',
      apartment_number: '2C',
      apartment_id: 'apt3',
      created: '2024-01-08T09:15:00Z',
      updated: '2024-01-08T09:15:00Z'
    }
  ]);

  const [apartments] = useState<Apartment[]>([
    { id: 'apt1', number: '3B', floor: 3, building: 'A' },
    { id: 'apt2', number: '1A', floor: 1, building: 'A' },
    { id: 'apt3', number: '2C', floor: 2, building: 'B' },
    { id: 'apt4', number: '4A', floor: 4, building: 'A' },
    { id: 'apt5', number: '1B', floor: 1, building: 'B' }
  ]);

  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.apartment_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddResident = () => {
    setEditingResident(null);
    setShowAddModal(true);
  };

  const handleEditResident = (resident: Resident) => {
    setEditingResident(resident);
    setShowAddModal(true);
  };

  const handleDeleteResident = async (residentId: string) => {
    if (window.confirm('Are you sure you want to delete this resident?')) {
      setIsLoading(true);
      // In real app, this would be an API call
      setTimeout(() => {
        setIsLoading(false);
        // Remove from state
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Residents</h1>
          <p className="text-gray-600">
            Manage residents in {complex?.name || 'your complex'}
          </p>
        </div>
        <Button onClick={handleAddResident} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Resident
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search residents by name, email, or apartment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Residents List */}
      <div className="grid gap-4">
        {filteredResidents.map((resident) => (
          <Card key={resident.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {resident.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{resident.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Building className="h-3 w-3" />
                        Apartment {resident.apartment_number}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {resident.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {resident.phone}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditResident(resident)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteResident(resident.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResidents.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No residents found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first resident.'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddResident}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Resident
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Modal - Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingResident ? 'Edit Resident' : 'Add New Resident'}
              </CardTitle>
              <CardDescription>
                {editingResident ? 'Update resident information' : 'Add a new resident to your complex'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    defaultValue={editingResident?.name || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    defaultValue={editingResident?.email || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    defaultValue={editingResident?.phone || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="apartment">Apartment</Label>
                  <select
                    id="apartment"
                    className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={editingResident?.apartment_id || ''}
                  >
                    <option value="">Select apartment</option>
                    {apartments.map((apt) => (
                      <option key={apt.id} value={apt.id}>
                        {apt.number} - Building {apt.building}, Floor {apt.floor}
                      </option>
                    ))}
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
                  {isLoading ? 'Saving...' : (editingResident ? 'Update' : 'Add')} Resident
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResidentsManagement;