import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowLeft, PlusCircle, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Define the structure for a client object
type Client = {
  id: string;
  name: string;
  email: string;
  caseType: 'Anxiety' | 'Depression' | 'Trauma' | 'Stress' | 'Other';
  severity: 'High' | 'Medium' | 'Low';
  nextAppointment: string;
};

// Mock data to simulate a client list from a database
const mockClients: Client[] = [
  { id: 'cli_1', name: 'Alice Johnson', email: 'alice@example.com', caseType: 'Anxiety', severity: 'High', nextAppointment: '2025-09-15' },
  { id: 'cli_2', name: 'Bob Williams', email: 'bob@example.com', caseType: 'Depression', severity: 'Medium', nextAppointment: '2025-09-18' },
  { id: 'cli_3', name: 'Charlie Brown', email: 'charlie@example.com', caseType: 'Stress', severity: 'Low', nextAppointment: '2025-09-22' },
  { id: 'cli_4', name: 'Diana Miller', email: 'diana@example.com', caseType: 'Trauma', severity: 'High', nextAppointment: '2025-09-16' },
  { id: 'cli_5', name: 'Ethan Davis', email: 'ethan@example.com', caseType: 'Anxiety', severity: 'Medium', nextAppointment: '2025-09-20' },
  { id: 'cli_6', name: 'Fiona Garcia', email: 'fiona@example.com', caseType: 'Other', severity: 'Low', nextAppointment: '2025-10-01' },
];

export const ClientManagement: React.FC = () => {
  // State to hold the list of clients
  const [clients] = useState<Client[]>(mockClients);
  
  // State for our filters
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [caseTypeFilter, setCaseTypeFilter] = useState<string>('all');

  // useMemo will re-calculate the filtered list only when clients or filters change
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const severityMatch = severityFilter === 'all' || client.severity === severityFilter;
      const caseTypeMatch = caseTypeFilter === 'all' || client.caseType === caseTypeFilter;
      return severityMatch && caseTypeMatch;
    });
  }, [clients, severityFilter, caseTypeFilter]);

  // Helper function to determine badge color based on severity
  const getSeverityBadgeVariant = (severity: 'High' | 'Medium' | 'Low'): 'destructive' | 'secondary' | 'outline' => {
    switch (severity) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        
        <Card className="bg-card/30 backdrop-blur-sm border-2 border-primary/20">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-start md:items-center space-x-4">
              <div className="p-4 rounded-xl bg-purple-400/10">
                  <Users className="h-7 w-7 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Client Management</CardTitle>
                <CardDescription>View, filter, and manage your clients.</CardDescription>
              </div>
            </div>
            <Button className="mt-4 md:mt-0">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Client
            </Button>
          </CardHeader>
          <CardContent>
            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-6">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by case type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Case Types</SelectItem>
                  <SelectItem value="Anxiety">Anxiety</SelectItem>
                  <SelectItem value="Depression">Depression</SelectItem>
                  <SelectItem value="Trauma">Trauma</SelectItem>
                  <SelectItem value="Stress">Stress</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Client Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead className="hidden md:table-cell">Case Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="hidden sm:table-cell">Next Appointment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-muted-foreground">{client.email}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{client.caseType}</TableCell>
                        <TableCell>
                          <Badge variant={getSeverityBadgeVariant(client.severity)}>
                            {client.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{client.nextAppointment}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Schedule Appointment</DropdownMenuItem>
                              <DropdownMenuItem>Edit Client</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No clients found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};