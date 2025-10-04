import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, ArrowLeft, BarChart, Users, CalendarCheck2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Bar, BarChart as RechartsBarChart, Line, LineChart, Radar, RadarChart, PolarGrid, PolarAngleAxis, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format } from 'date-fns';

// 1. Define data structures
type Client = {
  id: string;
  name: string;
  totalSessions: number;
  progressPercentage: number;
  lastSessionDate: Date;
  moodScores: { month: string; score: number }[];
  sessionAttendance: { status: string; count: number }[];
  wellnessWheel: { dimension: string; score: number }[];
};

// 2. Create rich mock data for multiple clients
const mockClientData: Client[] = [
  {
    id: 'client_a',
    name: 'Sarah M.',
    totalSessions: 24,
    progressPercentage: 78,
    lastSessionDate: new Date('2025-09-12T09:00:00'),
    moodScores: [
      { month: 'Apr', score: 6 }, { month: 'May', score: 5 }, { month: 'Jun', score: 7 },
      { month: 'Jul', score: 8 }, { month: 'Aug', score: 7 }, { month: 'Sep', score: 9 },
    ],
    sessionAttendance: [
      { status: 'Attended', count: 22 }, { status: 'Cancelled', count: 1 }, { status: 'No Show', count: 1 },
    ],
    wellnessWheel: [
      { dimension: 'Emotional', score: 80 }, { dimension: 'Social', score: 70 }, { dimension: 'Physical', score: 85 },
      { dimension: 'Intellectual', score: 90 }, { dimension: 'Spiritual', score: 65 }, { dimension: 'Occupational', score: 75 },
    ],
  },
  {
    id: 'client_b',
    name: 'Michael R.',
    totalSessions: 15,
    progressPercentage: 62,
    lastSessionDate: new Date('2025-09-10T14:30:00'),
    moodScores: [
      { month: 'Apr', score: 4 }, { month: 'May', score: 6 }, { month: 'Jun', score: 5 },
      { month: 'Jul', score: 7 }, { month: 'Aug', score: 8 }, { month: 'Sep', score: 7 },
    ],
    sessionAttendance: [
      { status: 'Attended', count: 14 }, { status: 'Cancelled', count: 1 }, { status: 'No Show', count: 0 },
    ],
    wellnessWheel: [
      { dimension: 'Emotional', score: 70 }, { dimension: 'Social', score: 80 }, { dimension: 'Physical', score: 60 },
      { dimension: 'Intellectual', score: 75 }, { dimension: 'Spiritual', score: 50 }, { dimension: 'Occupational', score: 85 },
    ],
  },
];

export const ProgressAnalytics: React.FC = () => {
  const [selectedClientId, setSelectedClientId] = useState<string>(mockClientData[0].id);

  const selectedClientData = useMemo(
    () => mockClientData.find(client => client.id === selectedClientId),
    [selectedClientId]
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        <Link to="/" className="inline-block">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-400/10">
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">Progress Analytics</h1>
              <p className="text-muted-foreground">Review client progress and wellness trends.</p>
            </div>
          </div>

          <div className="w-full md:w-64">
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {mockClientData.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedClientData ? (
          <div className="space-y-8">

            {/* Stat Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex justify-between items-center pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedClientData.totalSessions}</div>
                  <p className="text-xs text-muted-foreground">
                    Last session on {format(selectedClientData.lastSessionDate, 'PP')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex justify-between items-center pb-2">
                  <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedClientData.progressPercentage}%</div>
                  <p className="text-xs text-muted-foreground">Towards established therapy goals</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex justify-between items-center pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  <CalendarCheck2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {`${Math.round(
                      (selectedClientData.sessionAttendance[0].count / selectedClientData.totalSessions) * 100
                    )}%`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {`${selectedClientData.sessionAttendance[0].count} / ${selectedClientData.totalSessions} sessions attended`}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Mood Score Over Time</CardTitle>
                  <CardDescription>
                    Client-reported mood score (1-10 scale) over the last 6 months.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px] w-full">
                    <LineChart data={selectedClientData.moodScores}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis domain={[0, 10]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session Attendance</CardTitle>
                  <CardDescription>Breakdown of session attendance status.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px] w-full">
                    <RechartsBarChart
                      data={selectedClientData.sessionAttendance}
                      layout="vertical"
                      margin={{ left: 20 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="status" width={100} tickLine={false} axisLine={false} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} />
                    </RechartsBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

            </div>

            <Card>
              <CardHeader>
                <CardTitle>Wellness Wheel</CardTitle>
                <CardDescription>A holistic view of the client's self-reported wellness.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[400px] w-full">
                  <RadarChart data={selectedClientData.wellnessWheel}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Radar
                      name={selectedClientData.name}
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
            </Card>

          </div>
        ) : (
          <p className="text-center text-muted-foreground">Please select a client to view their analytics.</p>
        )}

      </div>
    </div>
  );
};
