import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Brain, ArrowLeft, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// 1. Define data structures for clients and activities
type Client = {
  id: string;
  name: string;
};

type Activity = {
  id: string;
  title: string;
  description: string;
  category: 'Mindfulness' | 'Journaling' | 'Cognitive Exercise' | 'Behavioral';
  datePublished: Date;
  assignedClientIds: string[];
};

// 2. Mock data
const mockClients: Client[] = [
  { id: 'client_a', name: 'Sarah M.' },
  { id: 'client_b', name: 'Michael R.' },
  { id: 'client_c', name: 'Emma L.' },
  { id: 'client_d', name: 'David K.' },
];

const initialActivities: Activity[] = [
    {
        id: 'act_1',
        title: 'Mindful Breathing Practice',
        description: 'Practice 5 minutes of mindful breathing every morning. Focus on the sensation of your breath entering and leaving your body. If your mind wanders, gently guide it back to your breath.',
        category: 'Mindfulness',
        datePublished: new Date('2025-09-10T10:00:00'),
        assignedClientIds: ['client_a', 'client_c'],
    }
];

export const AssessmentTools: React.FC = () => {
  // 3. State management
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State for the new activity form inside the dialog
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [newActivityCategory, setNewActivityCategory] = useState<'Mindfulness' | 'Journaling' | 'Cognitive Exercise' | 'Behavioral'>();
  const [selectedClientIds, setSelectedClientIds] = useState<{ [key: string]: boolean }>({});

  const resetForm = () => {
    setNewActivityTitle('');
    setNewActivityDesc('');
    setNewActivityCategory(undefined);
    setSelectedClientIds({});
  };

  const handlePublish = () => {
    // Basic validation
    if (!newActivityTitle || !newActivityDesc || !newActivityCategory) {
        alert('Please fill out all activity details.');
        return;
    }
    const assignedIds = Object.keys(selectedClientIds).filter(id => selectedClientIds[id]);
    if (assignedIds.length === 0) {
        alert('Please assign the activity to at least one client.');
        return;
    }

    const newActivity: Activity = {
        id: `act_${Date.now()}`,
        title: newActivityTitle,
        description: newActivityDesc,
        category: newActivityCategory,
        datePublished: new Date(),
        assignedClientIds: assignedIds,
    };

    setActivities(prev => [newActivity, ...prev]);
    resetForm();
    setIsDialogOpen(false);
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
          <CardHeader>
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                 <div className="flex items-center space-x-4">
                    <div className="p-4 rounded-xl bg-pink-400/10">
                        <Brain className="h-7 w-7 text-pink-400" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold">Client Activities</CardTitle>
                        <CardDescription>Design and assign activities to your clients.</CardDescription>
                    </div>
                 </div>
                 {/* Create Activity Dialog Trigger */}
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Create New Activity
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>Design New Activity</DialogTitle>
                            <DialogDescription>Fill out the details below and assign the activity to one or more clients.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            {/* Form Fields */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input id="title" value={newActivityTitle} onChange={(e) => setNewActivityTitle(e.target.value)} className="col-span-3" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <Select onValueChange={(value) => setNewActivityCategory(value as any)} value={newActivityCategory}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                                        <SelectItem value="Journaling">Journaling</SelectItem>
                                        <SelectItem value="Cognitive Exercise">Cognitive Exercise</SelectItem>
                                        <SelectItem value="Behavioral">Behavioral</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Description</Label>
                                <Textarea id="description" value={newActivityDesc} onChange={(e) => setNewActivityDesc(e.target.value)} className="col-span-3 min-h-[100px]" />
                            </div>
                             {/* Client Assignment */}
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Assign To</Label>
                                <div className="col-span-3 grid grid-cols-2 gap-4 p-4 border rounded-md">
                                    {mockClients.map(client => (
                                        <div key={client.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={client.id}
                                                checked={!!selectedClientIds[client.id]}
                                                onCheckedChange={(checked) => {
                                                    setSelectedClientIds(prev => ({...prev, [client.id]: !!checked}));
                                                }}
                                            />
                                            <Label htmlFor={client.id}>{client.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handlePublish}>Save & Publish</Button>
                        </DialogFooter>
                    </DialogContent>
                 </Dialog>
             </div>
          </CardHeader>
          <CardContent>
            {/* Table of Published Activities */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Activity Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Date Published</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                   {activities.length > 0 ? activities.map(activity => (
                        <TableRow key={activity.id}>
                            <TableCell className="font-medium">{activity.title}</TableCell>
                            <TableCell><Badge>{activity.category}</Badge></TableCell>
                            <TableCell>
                                {activity.assignedClientIds.map(id => mockClients.find(c => c.id === id)?.name).join(', ')}
                            </TableCell>
                            <TableCell>{format(activity.datePublished, 'PP')}</TableCell>
                        </TableRow>
                   )) : (
                     <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No activities published yet.
                        </TableCell>
                    </TableRow>
                   )}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};