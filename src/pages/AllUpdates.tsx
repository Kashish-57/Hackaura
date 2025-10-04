import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListChecks, ArrowLeft, TrendingUp, MessageSquare, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

// 1. Define the structure for an update and create mock data
type UpdateType = 'Report' | 'Message' | 'Resource';

type Update = {
  id: string;
  type: UpdateType;
  title: string;
  description: string;
  timestamp: Date;
  link: string;
};

// Mock data with recent timestamps (relative to Sep 12, 2025)
const mockUpdates: Update[] = [
  { id: 'upd_1', type: 'Report', title: 'New Wellness Report Available', description: 'Dr. Reed has published the Q3 wellness and progress report.', timestamp: new Date('2025-09-12T14:30:00'), link: '/reports' },
  { id: 'upd_2', type: 'Message', title: 'Message from Dr. Reed', description: '"Just sent over the latest progress report."', timestamp: new Date('2025-09-12T14:31:00'), link: '/communication' },
  { id: 'upd_3', type: 'Resource', title: 'New Article Added', description: '"Navigating Big Emotions" has been added to your resource library.', timestamp: new Date('2025-09-11T16:00:00'), link: '/resources' },
  { id: 'upd_4', type: 'Message', title: 'Appointment Confirmed', description: 'Your next appointment with Admin Support is confirmed for Sep 19, 2025.', timestamp: new Date('2025-09-10T11:00:00'), link: '/communication' },
  { id: 'upd_5', type: 'Report', title: 'Skills Assessment Completed', description: 'The latest skills development chart has been updated.', timestamp: new Date('2025-09-09T09:20:00'), link: '/reports' },
  { id: 'upd_6', type: 'Resource', title: 'New Video Added', description: '"Mindful Parenting Techniques" is now available to watch.', timestamp: new Date('2025-09-08T18:00:00'), link: '/resources' },
];

// Helper to get icon and color based on update type
const updateTypeDetails = {
  Report: { icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  Message: { icon: MessageSquare, color: 'text-teal-400', bg: 'bg-teal-400/10' },
  Resource: { icon: BookOpen, color: 'text-orange-400', bg: 'bg-orange-400/10' },
};

export function AllUpdates() {
  const [activeTab, setActiveTab] = useState<UpdateType | 'All'>('All');

  const filteredUpdates = useMemo(() => {
    if (activeTab === 'All') return mockUpdates;
    return mockUpdates.filter(update => update.type === activeTab);
  }, [activeTab]);

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
            <div className="p-3 rounded-lg bg-blue-400/10 mr-4">
                <ListChecks className="h-8 w-8 text-blue-400" />
            </div>
            <div>
                <h1 className="text-3xl font-bold">All Recent Updates</h1>
                <p className="text-muted-foreground">A complete log of your child's recent activities and alerts.</p>
            </div>
        </div>
        
        <Card>
          <CardHeader>
             <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList>
                  <TabsTrigger value="All">All Updates</TabsTrigger>
                  <TabsTrigger value="Report">Reports</TabsTrigger>
                  <TabsTrigger value="Message">Messages</TabsTrigger>
                  <TabsTrigger value="Resource">Resources</TabsTrigger>
                </TabsList>
              </Tabs>
          </CardHeader>
          <CardContent>
            {/* Timeline */}
            <div className="space-y-8">
              {filteredUpdates.length > 0 ? filteredUpdates.map(update => {
                const details = updateTypeDetails[update.type];
                const Icon = details.icon;
                return (
                  <div key={update.id} className="flex gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-full h-fit ${details.bg}`}>
                      <Icon className={`h-5 w-5 ${details.color}`} />
                    </div>
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{update.title}</p>
                          <p className="text-sm text-muted-foreground">{update.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(update.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                         <Link to={update.link}>
                            <Button variant="secondary" size="sm">View</Button>
                         </Link>
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No updates found for this category.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}