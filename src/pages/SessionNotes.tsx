import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; // A utility for conditional class names, common with shadcn/ui

// 1. Define the structure for a single session note
type SessionNote = {
  id: string;
  clientId: string;
  clientName: string;
  sessionDate: Date;
  title: string;
  content: string;
};

// 2. Create some mock data to work with
const mockNotes: SessionNote[] = [
  {
    id: 'note_1',
    clientId: 'client_a',
    clientName: 'Sarah M.',
    sessionDate: new Date('2025-09-12T09:00:00'),
    title: 'Progress on Anxiety Management',
    content: 'Client reported significant improvement in using the breathing techniques discussed last week. We explored cognitive reframing strategies to address negative self-talk. Plan to introduce mindfulness exercises next session.',
  },
  {
    id: 'note_2',
    clientId: 'client_b',
    clientName: 'Michael R.',
    sessionDate: new Date('2025-09-10T14:30:00'),
    title: 'Family Dynamics Discussion',
    content: 'Session focused on communication patterns within the family unit. Michael expressed feelings of being unheard. Role-playing exercises were used to practice active listening. Homework: Practice "I" statements with his partner.',
  },
  {
    id: 'note_3',
    clientId: 'client_c',
    clientName: 'Emma L.',
    sessionDate: new Date('2025-09-08T11:00:00'),
    title: 'Initial Assessment and Goal Setting',
    content: 'First session with Emma. Discussed history and reasons for seeking therapy. Primary goals include improving self-esteem and developing coping mechanisms for work-related stress. Agreed on weekly sessions to start.',
  },
];


export const SessionNotes: React.FC = () => {
  // 3. State management for the notes feature
  const [notes, setNotes] = useState<SessionNote[]>(mockNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(mockNotes[0]?.id || null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  // Find the currently selected note object
  const selectedNote = useMemo(() => 
    notes.find(note => note.id === selectedNoteId),
    [notes, selectedNoteId]
  );

  // 4. Effect to update the editor when the selected note changes
  useEffect(() => {
    if (selectedNote) {
      setEditedTitle(selectedNote.title);
      setEditedContent(selectedNote.content);
    } else {
      setEditedTitle('');
      setEditedContent('');
    }
  }, [selectedNote]);

  // 5. Handlers for CRUD operations
  const handleNewNote = () => {
    const newNote: SessionNote = {
      id: `note_${Date.now()}`,
      clientId: 'new_client', // In a real app, this would come from a client selector
      clientName: 'New Client',
      sessionDate: new Date(),
      title: 'New Session Note',
      content: '',
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const handleSaveNote = () => {
    if (!selectedNoteId) return;
    setNotes(notes.map(note => 
      note.id === selectedNoteId 
        ? { ...note, title: editedTitle, content: editedContent } 
        : note
    ));
    alert('Note saved!'); // In a real app, you'd show a toast notification
  };

  const handleDeleteNote = () => {
    if (!selectedNoteId) return;
    if (window.confirm('Are you sure you want to delete this note?')) {
        setNotes(notes.filter(note => note.id !== selectedNoteId));
        setSelectedNoteId(notes[0]?.id || null);
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
          <CardHeader>
            <div className="flex items-start md:items-center space-x-4">
              <div className="p-4 rounded-xl bg-teal-400/10">
                  <FileText className="h-7 w-7 text-teal-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Session Notes</CardTitle>
                <CardDescription>Access and update therapy session documentation.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* 6. Two-column layout for notes list and editor */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Left Column: Notes List */}
              <div className="md:col-span-1 border-r pr-4">
                <Button onClick={handleNewNote} className="w-full mb-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Note
                </Button>
                <div className="space-y-2 h-[500px] overflow-y-auto">
                  {notes.map(note => (
                    <div
                      key={note.id}
                      onClick={() => setSelectedNoteId(note.id)}
                      className={cn(
                        'p-3 rounded-md cursor-pointer border',
                        selectedNoteId === note.id 
                          ? 'bg-primary/20 border-primary' 
                          : 'bg-muted/30 hover:bg-muted/60'
                      )}
                    >
                      <p className="font-semibold truncate">{note.title}</p>
                      <p className="text-sm text-muted-foreground">{note.clientName}</p>
                      <p className="text-xs text-muted-foreground">{format(note.sessionDate, 'PP')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Editor */}
              <div className="md:col-span-3">
                {selectedNote ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                            Editing note for <span className="text-primary">{selectedNote.clientName}</span>
                        </h3>
                        <div className="space-x-2">
                           <Button onClick={handleSaveNote} size="sm">Save Note</Button>
                           <Button onClick={handleDeleteNote} size="sm" variant="destructive">
                             <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                    </div>
                    <Input
                      placeholder="Note Title"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-lg font-bold h-12"
                    />
                    <Textarea
                      placeholder="Type your session notes here..."
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="min-h-[400px] text-base"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Select a note to view or create a new one.</p>
                  </div>
                )}
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};