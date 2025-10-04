import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MessageSquare, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Mock Data for Messaging
const conversations = [
  { id: 'convo_1', therapistName: 'Dr. Evelyn Reed', lastMessage: 'Just sent over the latest progress report.', timestamp: new Date('2025-09-12T14:30:00'), unread: 1, avatar: '/avatars/01.png' },
  { id: 'convo_2', therapistName: 'Admin Support', lastMessage: 'Your next appointment is confirmed.', timestamp: new Date('2025-09-10T11:00:00'), unread: 0, avatar: '/avatars/02.png' },
];

const messages = {
  convo_1: [
    { id: 'msg_1', sender: 'Dr. Evelyn Reed', text: 'Hi there! Just wanted to follow up on our last session. How has the new morning routine been going?', timestamp: new Date('2025-09-12T10:00:00') },
    { id: 'msg_2', sender: 'You', text: 'It\'s been going great! Much less stressful.', timestamp: new Date('2025-09-12T10:05:00') },
    { id: 'msg_3', sender: 'Dr. Evelyn Reed', text: 'Wonderful to hear! Just sent over the latest progress report.', timestamp: new Date('2025-09-12T14:30:00') },
  ],
  convo_2: [
    { id: 'msg_4', sender: 'Admin Support', text: 'Your next appointment is confirmed for Sep 19, 2025.', timestamp: new Date('2025-09-10T11:00:00') },
  ],
};

export function CommunicationHub() {
  const [selectedConvoId, setSelectedConvoId] = useState('convo_1');

  const selectedMessages = useMemo(() => {
    return messages[selectedConvoId as keyof typeof messages] || [];
  }, [selectedConvoId]);
  
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
            <div className="p-3 rounded-lg bg-teal-400/10 mr-4">
                <MessageSquare className="h-8 w-8 text-teal-400" />
            </div>
            <div>
                <h1 className="text-3xl font-bold">Communication Hub</h1>
                <p className="text-muted-foreground">Messages and updates from your child's wellness journey.</p>
            </div>
        </div>

        <Card className="grid grid-cols-1 md:grid-cols-4 min-h-[600px]">
          {/* Conversation List */}
          <div className="md:col-span-1 border-r">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Conversations</h3>
            </div>
            <div className="flex flex-col">
              {conversations.map(convo => (
                <div key={convo.id}
                  onClick={() => setSelectedConvoId(convo.id)}
                  className={cn('p-4 flex items-start gap-4 cursor-pointer border-b hover:bg-muted/50',
                    selectedConvoId === convo.id && 'bg-muted'
                  )}
                >
                  <Avatar>
                    <AvatarImage src={convo.avatar} />
                    <AvatarFallback>{convo.therapistName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{convo.therapistName}</p>
                    <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div className="md:col-span-3 flex flex-col">
             <div className="p-4 border-b flex-shrink-0">
               <h3 className="font-semibold text-lg">{conversations.find(c => c.id === selectedConvoId)?.therapistName}</h3>
             </div>
             <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {selectedMessages.map(msg => (
                  <div key={msg.id} className={cn('flex flex-col', msg.sender === 'You' ? 'items-end' : 'items-start')}>
                    <div className={cn('max-w-xs p-3 rounded-lg', msg.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      {msg.text}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{format(msg.timestamp, 'p')}</p>
                  </div>
                ))}
             </div>
             <div className="p-4 border-t flex-shrink-0 flex gap-2">
                <Input placeholder="Type a message..." />
                <Button><Send className="h-4 w-4" /></Button>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}