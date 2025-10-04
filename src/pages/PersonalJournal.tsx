import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import the hook
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  BookOpen,
  Save,
  Plus,
  Laugh,
  Droplet,
  Cloud,
  Lightbulb,
  Zap,
  HandCoins,
  Angry
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// --- FIX 1: Mood options now use numbers for 'value' and a key for the name ---
const moodOptions = [
  { value: 1, nameKey: 'personalJournal.moods.happy', icon: <Laugh className="h-4 w-4" /> },
  { value: 2, nameKey: 'personalJournal.moods.lonely', icon: <Droplet className="h-4 w-4" /> },
  { value: 3, nameKey: 'personalJournal.moods.demotivated', icon: <HandCoins className="h-4 w-4" /> },
  { value: 4, nameKey: 'personalJournal.moods.angry', icon: <Angry className="h-4 w-4" /> },
  { value: 5, nameKey: 'personalJournal.moods.carefree', icon: <Cloud className="h-4 w-4" /> },
  { value: 6, nameKey: 'personalJournal.moods.tensed', icon: <Zap className="h-4 w-4" /> },
  { value: 7, nameKey: 'personalJournal.moods.curious', icon: <Lightbulb className="h-4 w-4" /> },
];

export function PersonalJournal() {
  const { t } = useTranslation(); // Initialize the hook
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // --- FIX 2: State now holds a number, initialized to 1 ('Happy') ---
  const [moodRating, setMoodRating] = useState(1);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !user) return;

    setSaving(true);
    try {
      // The 'mood_rating' being sent is now correctly a number
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          mood_rating: moodRating
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journal entry saved successfully"
      });

      setTitle('');
      setContent('');
      setMoodRating(1); // Reset to default mood
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('personalJournal.backToDashboard')}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">{t('personalJournal.title')}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Journal Entries List */}
          <div className="lg:col-span-1">
            <div className="text-center mb-6">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">{t('personalJournal.entries.title')}</h2>
            </div>
            
            <Button className="w-full mb-4">
              <Plus className="h-4 w-4 mr-2" />
              {t('personalJournal.entries.newEntry')}
            </Button>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : entries.length > 0 ? (
                entries.map((entry) => (
                  <Card key={entry.id} className="cursor-pointer hover:bg-accent/10 transition-colors">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-foreground/80">
                        {entry.content.substring(0, 100)}...
                      </p>
                      {entry.mood_rating && (
                        <div className="mt-2 flex items-center gap-2">
                          {moodOptions.find(mood => mood.value === entry.mood_rating)?.icon}
                          <span className="text-xs text-muted-foreground">
                            {t('personalJournal.entries.mood')}: {t(moodOptions.find(mood => mood.value === entry.mood_rating)?.nameKey || '')}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {t('personalJournal.entries.noEntries')}
                </p>
              )}
            </div>
          </div>

          {/* Journal Editor */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>{t('personalJournal.editor.title')}</CardTitle>
                <CardDescription>{t('personalJournal.editor.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('personalJournal.editor.titlePlaceholder')}
                  className="text-lg"
                />
                <div className="space-y-2">
                  <Label>{t('personalJournal.editor.moodLabel')}</Label>
                  {/* --- FIX 3: Select now uses a number value and converts the string from onValueChange --- */}
                  <Select value={String(moodRating)} onValueChange={(value) => setMoodRating(Number(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('personalJournal.editor.moodPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {moodOptions.map(option => (
                        <SelectItem key={option.value} value={String(option.value)}>
                          <div className="flex items-center gap-2">
                            {option.icon}
                            <span>{t(option.nameKey)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t('personalJournal.editor.contentPlaceholder')}
                  className="min-h-[300px] resize-none"
                />
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    {content.length} {t('personalJournal.editor.characterCount')}
                  </p>
                  <Button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? t('personalJournal.editor.saving') : t('personalJournal.editor.saveEntry')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}