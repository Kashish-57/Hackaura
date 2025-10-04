import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calender';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, isBefore, isSameDay, startOfDay } from 'date-fns';

// Define the structure for an appointment
type Appointment = {
  id: string;
  clientName: string;
  sessionType: string;
  dateTime: Date;
  status: 'completed' | 'pending' | 'cancelled';
};

// Mock data remains the same
const mockAppointments: Appointment[] = [
  { id: 'app_1', clientName: 'Sarah M.', sessionType: 'Individual Therapy', dateTime: new Date('2025-09-12T09:00:00'), status: 'completed' },
  { id: 'app_2', clientName: 'Michael R.', sessionType: 'Family Session', dateTime: new Date('2025-09-12T10:30:00'), status: 'completed' },
  { id: 'app_3', clientName: 'Emma L.', sessionType: 'Assessment', dateTime: new Date('2025-09-12T14:00:00'), status: 'pending' },
  { id: 'app_4', clientName: 'David K.', sessionType: 'Follow-up', dateTime: new Date('2025-09-12T15:30:00'), status: 'pending' },
  { id: 'app_5', clientName: 'John Doe', sessionType: 'Consultation', dateTime: new Date('2025-09-10T11:00:00'), status: 'pending' }, 
  { id: 'app_9', clientName: 'Cancelled Co.', sessionType: 'Intro Call', dateTime: new Date('2025-09-11T09:00:00'), status: 'cancelled' },
  { id: 'app_6', clientName: 'Jane Smith', sessionType: 'Individual Therapy', dateTime: new Date('2025-09-15T10:00:00'), status: 'completed' },
  { id: 'app_7', clientName: 'Peter Jones', sessionType: 'Couples Therapy', dateTime: new Date('2025-09-15T13:00:00'), status: 'pending' },
  { id: 'app_8', clientName: 'Mary Brown', sessionType: 'Follow-up', dateTime: new Date('2025-09-22T16:00:00'), status: 'completed' },
  { id: 'app_10', clientName: 'Future Cancel', sessionType: 'Planning', dateTime: new Date('2025-09-23T11:00:00'), status: 'cancelled' },
  { id: 'app_11', clientName: 'Also Cancelled', sessionType: 'Planning', dateTime: new Date('2025-09-23T12:00:00'), status: 'cancelled' },
];

export const FullSchedule: React.FC = () => {
  const today = startOfDay(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);

  // Data processing logic remains the same
  const processedAppointments = useMemo(() => {
    return mockAppointments.map(app => {
      if (isBefore(app.dateTime, today) && app.status === 'pending') {
        return { ...app, status: 'completed' } as Appointment;
      }
      return app;
    });
  }, []);

  const appointmentDateStatus = useMemo(() => {
    const statusMap = new Map<string, 'pending' | 'completed' | 'cancelled'>();
    const appointmentsByDay: Record<string, Appointment[]> = {};
    processedAppointments.forEach(app => {
      const day = startOfDay(app.dateTime).toISOString();
      if (!appointmentsByDay[day]) {
        appointmentsByDay[day] = [];
      }
      appointmentsByDay[day].push(app);
    });
    for (const day in appointmentsByDay) {
      const appointments = appointmentsByDay[day];
      if (appointments.some(app => app.status === 'pending')) {
        statusMap.set(day, 'pending');
      } else if (appointments.some(app => app.status === 'completed')) {
        statusMap.set(day, 'completed');
      } else {
        statusMap.set(day, 'cancelled');
      }
    }
    return statusMap;
  }, [processedAppointments]);

  const appointmentsForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    return processedAppointments
      .filter(app => isSameDay(app.dateTime, selectedDate))
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
  }, [selectedDate, processedAppointments]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/"> 
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex items-center mb-8">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg mr-4">
            <CalendarDays className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Full Schedule</h1>
            <p className="text-muted-foreground">View and manage your appointments.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Calendar */}
          <div className="lg:col-span-1">
             <Card className="bg-card/30 backdrop-blur-sm border-2 border-primary/20 p-3">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="p-0"
                    modifiers={{ hasAppointment: (date) => appointmentDateStatus.has(startOfDay(date).toISOString())}}
                    modifiersClassNames={{ today: 'bg-blue-500/80 text-primary-foreground rounded-md', selected: 'bg-primary text-primary-foreground rounded-md'}}
                    components={{
                      DayContent: (props) => {
                        const dayStatus = appointmentDateStatus.get(startOfDay(props.date).toISOString());
                        // --- 👇 CHANGE IS HERE ---
                        const statusToColor: Record<string, string> = { 
                            pending: 'bg-yellow-500', // Changed from orange to yellow
                            completed: 'bg-green-400', 
                            cancelled: 'bg-gray-400'
                        };
                        return (
                          <div className="relative w-full h-full flex items-center justify-center">
                            {props.date.getDate()}
                            {dayStatus && (<div className={`absolute bottom-1 w-1.5 h-1.5 ${statusToColor[dayStatus]} rounded-full`}></div>)}
                          </div>
                        )
                      }
                    }}
                />
             </Card>
          </div>

          {/* Right Column: Appointments Table */}
          <div className="lg:col-span-2">
            <Card className="bg-card/30 backdrop-blur-sm border-2 border-primary/20">
              <CardHeader>
                <CardTitle>
                  Schedule for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Session Type</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointmentsForSelectedDay.length > 0 ? (
                      appointmentsForSelectedDay.map(app => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.clientName}</TableCell>
                          <TableCell>{app.sessionType}</TableCell>
                          <TableCell>{format(app.dateTime, 'hh:mm a')}</TableCell>
                          <TableCell>
                            {/* --- 👇 CHANGE IS HERE --- */}
                            <Badge
                              variant={
                                app.status === 'completed' ? 'default'
                                : app.status === 'cancelled' ? 'destructive'
                                : 'outline' // Use a neutral variant for pending
                              }
                              className={
                                app.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400 font-semibold' // Apply custom yellow style
                                : ''
                              }
                            >
                              {app.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No appointments for this day.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};