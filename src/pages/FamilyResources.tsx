import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock Data for Resources
const resources = [
  { id: 'res_1', type: 'Article', title: 'Understanding Anxiety in Children', description: 'A guide to recognizing the signs of anxiety and how to support your child.', category: 'Anxiety', image: '/resources/anxiety.png' },
  { id: 'res_2', type: 'Video', title: 'Mindful Parenting Techniques', description: 'Watch this 10-minute video to learn simple mindfulness exercises you can do with your child.', category: 'Mindfulness', image: '/resources/mindfulness.png' },
  { id: 'res_3', type: 'Article', title: 'Navigating Big Emotions', description: 'Learn strategies to help your child identify and manage strong feelings like anger and sadness.', category: 'Emotions', image: '/resources/emotions.png' },
  { id: 'res_4', type: 'Article', title: 'Building Resilience in Your Child', description: 'Discover key factors in fostering resilience and a growth mindset.', category: 'Anxiety', image: '/resources/resilience.png' },
  { id: 'res_5', type: 'Video', title: 'The Importance of Play', description: 'A short documentary on how play contributes to healthy development and emotional regulation.', category: 'Emotions', image: '/resources/play.png' },
];

export function FamilyResources() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesCategory = activeTab === 'All' || res.category === activeTab;
      const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || res.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchTerm]);

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
            <div className="p-3 rounded-lg bg-orange-400/10 mr-4">
                <BookOpen className="h-8 w-8 text-orange-400" />
            </div>
            <div>
                <h1 className="text-3xl font-bold">Family Resources</h1>
                <p className="text-muted-foreground">Tools and guides for supporting your child.</p>
            </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="All">All Resources</TabsTrigger>
                  <TabsTrigger value="Anxiety">Anxiety</TabsTrigger>
                  <TabsTrigger value="Mindfulness">Mindfulness</TabsTrigger>
                  <TabsTrigger value="Emotions">Emotions</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search resources..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.length > 0 ? filteredResources.map(res => (
                <Card key={res.id} className="flex flex-col">
                  <div className="h-40 bg-muted rounded-t-lg flex items-center justify-center">
                    {/* Placeholder for an image */}
                    <img src={res.image} alt={res.title} className="object-cover h-full w-full rounded-t-lg" />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{res.title}</CardTitle>
                      <Badge variant={res.type === 'Video' ? 'default' : 'secondary'}>{res.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground text-sm">{res.description}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button className="w-full">{res.type === 'Video' ? 'Watch Video' : 'Read Article'}</Button>
                  </div>
                </Card>
              )) : (
                 <div className="col-span-full text-center py-16">
                    <p className="text-muted-foreground">No resources found matching your criteria.</p>
                 </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}