import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Users, 
  Building, 
  DoorOpen, 
  TrendingUp, 
  Plus, 
  UserPlus, 
  Home,
  Shield,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar,
  Eye
} from 'lucide-react';

interface DashboardStats {
  totalResidents: number;
  totalApartments: number;
  activeGates: number;
  monthlyGrowth: number;
  occupancyRate: number;
  pendingRequests: number;
  activePermissions: number;
  systemAlerts: number;
}

interface ActivityItem {
  id: string;
  type: 'resident' | 'apartment' | 'gate' | 'permission' | 'alert';
  action: string;
  details: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

interface SystemAlert {
  id: string;
  type: 'maintenance' | 'security' | 'system' | 'access';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
}

const Dashboard: React.FC = () => {
  const { user, complex } = useAuth();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, this would come from React Query
  const [stats] = useState<DashboardStats>({
    totalResidents: 156,
    totalApartments: 89,
    activeGates: 4,
    monthlyGrowth: 12,
    occupancyRate: 87.6,
    pendingRequests: 3,
    activePermissions: 142,
    systemAlerts: 2
  });

  const [recentActivity] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'resident',
      action: 'New resident registered',
      details: 'John Smith - Apartment 3B',
      timestamp: '2024-01-20T14:30:00Z',
      status: 'success'
    },
    {
      id: '2',
      type: 'apartment',
      action: 'Access code generated',
      details: 'Apartment 5A - Code: ABC123',
      timestamp: '2024-01-20T12:15:00Z',
      status: 'info'
    },
    {
      id: '3',
      type: 'gate',
      action: 'Gate permission updated',
      details: 'Main Entrance - Maria Garcia',
      timestamp: '2024-01-20T10:45:00Z',
      status: 'success'
    },
    {
      id: '4',
      type: 'alert',
      action: 'System maintenance scheduled',
      details: 'Parking Barrier - Tomorrow 2:00 AM',
      timestamp: '2024-01-20T09:00:00Z',
      status: 'warning'
    },
    {
      id: '5',
      type: 'permission',
      action: 'Visitor access granted',
      details: 'Jane Doe - Apartment 2C (24h)',
      timestamp: '2024-01-19T16:20:00Z',
      status: 'info'
    }
  ]);

  const [systemAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'maintenance',
      message: 'Parking barrier requires maintenance check',
      severity: 'medium',
      timestamp: '2024-01-20T08:00:00Z',
      resolved: false
    },
    {
      id: '2',
      type: 'security',
      message: 'Multiple failed access attempts detected',
      severity: 'high',
      timestamp: '2024-01-20T07:30:00Z',
      resolved: false
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'resident': return Users;
      case 'apartment': return Building;
      case 'gate': return DoorOpen;
      case 'permission': return Shield;
      case 'alert': return AlertTriangle;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-96 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="text-gray-600">
            Here's what's happening in {complex?.name || 'your complex'} today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '24h' | '7d' | '30d')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* System Alerts */}
      {systemAlerts.filter(alert => !alert.resolved).length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-800">System Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {systemAlerts.filter(alert => !alert.resolved).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                        getSeverityColor(alert.severity)
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium">{alert.message}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(alert.timestamp)}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResidents}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +{stats.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(stats.totalApartments * stats.occupancyRate / 100)} of {stats.totalApartments} apartments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Permissions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePermissions}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.activeGates} gates & barriers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Require your attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates and changes in your complex
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-3 w-3 mr-1" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-full bg-gray-100 ${getStatusColor(activity.status)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.details}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Resident
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Register Apartment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DoorOpen className="mr-2 h-4 w-4" />
                Configure Gate Access
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Manage Permissions
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Maintenance
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;