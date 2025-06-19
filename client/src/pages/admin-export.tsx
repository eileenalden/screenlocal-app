import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Users, Calendar, Mail } from "lucide-react";

interface EarlyUser {
  id: number;
  email: string;
  userType: string;
  challenge: string;
  wantedFeatures: string[];
  otherFeature?: string;
  name: string;
  company: string;
  submittedAt: string;
}

export default function AdminExport() {
  const [earlyUsers, setEarlyUsers] = useState<EarlyUser[]>([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('earlyUsers') || '[]');
    setEarlyUsers(users);
  }, []);

  const exportToCSV = () => {
    if (earlyUsers.length === 0) {
      alert('No data to export');
      return;
    }

    const csvHeaders = [
      'ID',
      'Email', 
      'User Type',
      'Challenge',
      'Wanted Features',
      'Other Feature',
      'Name',
      'Company',
      'Submitted At'
    ];

    const csvRows = earlyUsers.map(user => [
      user.id,
      user.email,
      user.userType,
      `"${user.challenge.replace(/"/g, '""')}"`, // Escape quotes in challenge text
      `"${user.wantedFeatures.join(', ')}"`,
      `"${(user.otherFeature || '').replace(/"/g, '""')}"`,
      user.name,
      user.company,
      new Date(user.submittedAt).toLocaleString()
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `screenlocal-early-users-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all early user data? This cannot be undone.')) {
      localStorage.removeItem('earlyUsers');
      setEarlyUsers([]);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Early User Export</h1>
          <p className="text-gray-600">Manage and export early user interest data for ScreenLocal</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{earlyUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Emails Collected</p>
                  <p className="text-2xl font-bold text-gray-900">{earlyUsers.filter(u => u.email).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Latest Signup</p>
                  <p className="text-sm font-bold text-gray-900">
                    {earlyUsers.length > 0 
                      ? formatDate(earlyUsers[earlyUsers.length - 1].submittedAt).split(',')[0]
                      : 'None'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Download className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Export Ready</p>
                  <p className="text-2xl font-bold text-gray-900">{earlyUsers.length > 0 ? '✓' : '✗'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={exportToCSV}
            disabled={earlyUsers.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export to CSV
          </Button>
          <Button 
            variant="destructive"
            onClick={clearData}
            disabled={earlyUsers.length === 0}
          >
            Clear All Data
          </Button>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Early User Data</CardTitle>
          </CardHeader>
          <CardContent>
            {earlyUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No early user data collected yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>User Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Wanted Features</TableHead>
                      <TableHead>Other Feature</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {earlyUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{user.userType}</TableCell>
                        <TableCell>{user.name || '-'}</TableCell>
                        <TableCell>{user.company || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate" title={user.challenge}>
                          {user.challenge || '-'}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {user.wantedFeatures.map((feature, idx) => (
                              <span 
                                key={idx}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={user.otherFeature}>
                          {user.otherFeature || '-'}
                        </TableCell>
                        <TableCell>{formatDate(user.submittedAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}