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
  Building, 
  Key, 
  Users, 
  Copy, 
  RefreshCw,
  QrCode
} from 'lucide-react';

interface Apartment {
  id: string;
  number: string;
  floor: number;
  building: string;
  residents_count: number;
  access_code: string;
  code_expires: string;
  created: string;
  updated: string;
}

const ApartmentManagement: React.FC = () => {
  const { complex } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [showCodeModal, setShowCodeModal] = useState<Apartment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, this would come from React Query
  const [apartments] = useState<Apartment[]>([
    {
      id: '1',
      number: '1A',
      floor: 1,
      building: 'A',
      residents_count: 2,
      access_code: 'A1B2C3',
      code_expires: '2024-02-15T23:59:59Z',
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      number: '2C',
      floor: 2,
      building: 'B',
      residents_count: 1,
      access_code: 'X7Y8Z9',
      code_expires: '2024-02-20T23:59:59Z',
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-10T14:30:00Z'
    },
    {
      id: '3',
      number: '3B',
      floor: 3,
      building: 'A',
      residents_count: 3,
      access_code: 'M4N5P6',
      code_expires: '2024-02-10T23:59:59Z',
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-08T09:15:00Z'
    },
    {
      id: '4',
      number: '4A',
      floor: 4,
      building: 'A',
      residents_count: 0,
      access_code: 'Q1W2E3',
      code_expires: '2024-02-25T23:59:59Z',
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z'
    }
  ]);

  const filteredApartments = apartments.filter(apartment =>
    apartment.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apartment.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddApartment = () => {
    setEditingApartment(null);
    setShowAddModal(true);
  };

  const handleEditApartment = (apartment: Apartment) => {
    setEditingApartment(apartment);
    setShowAddModal(true);
  };

  const handleDeleteApartment = async (apartmentId: string) => {
    if (window.confirm('Are you sure you want to delete this apartment?')) {
      setIsLoading(true);
      // In real app, this would be an API call
      setTimeout(() => {
        setIsLoading(false);
        // Remove from state
      }, 1000);
    }
  };

  const handleGenerateCode = async (apartment: Apartment) => {
    setIsLoading(true);
    // In real app, this would be an API call to generate new code
    setTimeout(() => {
      setIsLoading(false);
      // Update apartment with new code
    }, 1000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // Show toast notification in real app
  };

  const isCodeExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apartments</h1>
          <p className="text-gray-600">
            Manage apartments and access codes in {complex?.name || 'your complex'}
          </p>
        </div>
        <Button onClick={handleAddApartment} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Apartment
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search apartments by number or building..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apartments Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredApartments.map((apartment) => {
          const codeExpired = isCodeExpired(apartment.code_expires);
          return (
            <Card key={apartment.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Apartment {apartment.number}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditApartment(apartment)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteApartment(apartment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Building {apartment.building}, Floor {apartment.floor}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    {apartment.residents_count} residents
                  </div>
                </div>

                {/* Access Code Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Access Code</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCodeModal(apartment)}
                    >
                      <QrCode className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className={`flex-1 px-2 py-1 text-sm font-mono rounded border ${
                      codeExpired ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50'
                    }`}>
                      {apartment.access_code}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(apartment.access_code)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${
                      codeExpired ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {codeExpired ? 'Expired' : 'Expires'}: {formatDate(apartment.code_expires)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateCode(apartment)}
                      disabled={isLoading}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredApartments.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No apartments found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first apartment.'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddApartment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Apartment
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
                {editingApartment ? 'Edit Apartment' : 'Add New Apartment'}
              </CardTitle>
              <CardDescription>
                {editingApartment ? 'Update apartment information' : 'Add a new apartment to your complex'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="number">Apartment Number</Label>
                  <Input
                    id="number"
                    placeholder="e.g., 1A, 2B, 301"
                    defaultValue={editingApartment?.number || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="building">Building</Label>
                  <Input
                    id="building"
                    placeholder="e.g., A, B, Main"
                    defaultValue={editingApartment?.building || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    type="number"
                    placeholder="Floor number"
                    defaultValue={editingApartment?.floor || ''}
                  />
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
                  {isLoading ? 'Saving...' : (editingApartment ? 'Update' : 'Add')} Apartment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Code Details Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Code Details</CardTitle>
              <CardDescription>
                Apartment {showCodeModal.number} - Building {showCodeModal.building}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400" />
                    <span className="sr-only">QR Code placeholder</span>
                  </div>
                  <code className="text-2xl font-mono font-bold">
                    {showCodeModal.access_code}
                  </code>
                  <p className="text-sm text-gray-500 mt-2">
                    Expires: {formatDate(showCodeModal.code_expires)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleCopyCode(showCodeModal.access_code)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleGenerateCode(showCodeModal)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New Code
                  </Button>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setShowCodeModal(null)}>
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

export default ApartmentManagement;