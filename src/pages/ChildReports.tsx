import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TrendingUp, ArrowLeft, CalendarCheck2, Smile, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Mock Data for Child's Progress
const progressData = {
  kpi: {
    attendance: 92,
    overallMood: 'Positive',
    skillsMastered: 8,
  },
  wellbeingScores: [
    { month: 'Apr', score: 7 }, { month: 'May', score: 6 }, { month: 'Jun', score: 8 },
    { month: 'Jul', score: 7 }, { month: 'Aug', score: 9 }, { month: 'Sep', score: 8 },
  ],
  skillDevelopment: [
    { skill: 'Communication', level: 4 }, { skill: 'Coping', level: 5 },
    { skill: 'Socializing', level: 3 }, { skill: 'Focus', level: 4 },
  ],
};

export function ChildReports() {
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
            <div className="p-3 rounded-lg bg-purple-400/10 mr-4">
                <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
            <div>
                <h1 className="text-3xl font-bold">Child Wellness Overview</h1>
                <p className="text-muted-foreground">Monitor your child's emotional and academic progress.</p>
            </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Session Attendance</CardTitle>
              <CalendarCheck2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData.kpi.attendance}%</div>
              <p className="text-xs text-muted-foreground">Based on scheduled sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Mood Trend</CardTitle>
              <Smile className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData.kpi.overallMood}</div>
              <p className="text-xs text-muted-foreground">Reported by therapist</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills Mastered</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData.kpi.skillsMastered} / 12</div>
              <p className="text-xs text-muted-foreground">Developmental goals achieved</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Emotional Well-being</CardTitle>
              <CardDescription>Score (1-10) over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px] w-full">
                <LineChart data={progressData.wellbeingScores}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis domain={[0, 10]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Skill Development</CardTitle>
              <CardDescription>Current proficiency level (1-5) in key areas.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px] w-full">
                <BarChart data={progressData.skillDevelopment}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="skill" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis domain={[0, 5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="level" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}