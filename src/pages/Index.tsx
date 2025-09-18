import { useState } from 'react';
import { useItems } from '@/hooks/useItems';
import { useTags } from '@/hooks/useTags';
import { MonthGrid } from '@/components/MonthGrid';
import { ItemsList } from '@/components/ItemsList';
import { ItemModal } from '@/components/ItemModal';
import { TagModal } from '@/components/TagModal';
import { TagsList } from '@/components/TagsList';
import { TagFilter } from '@/components/TagFilter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarItem, MONTHS, Tag } from '@/types/item';
import { Plus, Calendar, ArrowLeft, Hash, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { items, addItem, updateItem, deleteItem, getItemsForMonth } = useItems();
  const { 
    tags, 
    addTag, 
    updateTag, 
    deleteTag, 
    getCategoryTags, 
    getCalendarTags, 
    getMonthsFromCalendarTags 
  } = useTags();
  
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CalendarItem | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const { toast } = useToast();

  const categoryTags = getCategoryTags();
  const calendarTags = getCalendarTags();

  // Enhanced getItemsForMonth to include calendar tag filtering and tag filters
  const getItemsForMonthWithTags = (month: number) => {
    return items.filter(item => {
      // First check if item belongs to this month
      const belongsToMonth = item.months.includes(month) || 
        (item.calendarTags?.length > 0 && 
         calendarTags.filter(tag => item.calendarTags.includes(tag.id))
           .some(tag => tag.months?.includes(month)));
      
      if (!belongsToMonth) return false;
      
      // Then apply tag filters if any are selected
      if (selectedTagIds.length === 0) return true;
      
      // Check if item has any of the selected tags
      const itemTagIds = [...(item.categoryTags || []), ...(item.calendarTags || [])];
      return selectedTagIds.some(tagId => itemTagIds.includes(tagId));
    });
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(selectedMonth === month ? null : month);
    setActiveTab('calendar');
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: CalendarItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleAddTag = () => {
    setEditingTag(null);
    setIsTagModalOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setIsTagModalOpen(true);
  };

  const handleSaveItem = (itemData: Omit<CalendarItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    addItem(itemData);
    toast({
      title: "Item added!",
      description: `"${itemData.name}" has been added to your calendar.`,
    });
  };

  const handleUpdateItem = (id: string, updates: Partial<Omit<CalendarItem, 'id' | 'createdAt'>>) => {
    updateItem(id, updates);
    toast({
      title: "Item updated!",
      description: "Your item has been successfully updated.",
    });
  };

  const handleDeleteItem = (id: string) => {
    const item = items.find(i => i.id === id);
    deleteItem(id);
    toast({
      title: "Item deleted!",
      description: item ? `"${item.name}" has been removed.` : "Item has been removed.",
    });
  };

  const handleSaveTag = (tagData: Omit<Tag, 'id' | 'createdAt'>) => {
    addTag(tagData);
    toast({
      title: "Tag created!",
      description: `"${tagData.name}" tag has been created.`,
    });
  };

  const handleUpdateTag = (id: string, updates: Partial<Omit<Tag, 'id' | 'createdAt'>>) => {
    updateTag(id, updates);
    toast({
      title: "Tag updated!",
      description: "Your tag has been successfully updated.",
    });
  };

  const handleDeleteTag = (id: string) => {
    const tag = tags.find(t => t.id === id);
    deleteTag(id);
    toast({
      title: "Tag deleted!",
      description: tag ? `"${tag.name}" tag has been removed.` : "Tag has been removed.",
    });
  };

  const handleTagSelect = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleClearFilter = () => {
    setSelectedTagIds([]);
  };

  const selectedMonthItems = selectedMonth !== null ? getItemsForMonthWithTags(selectedMonth) : [];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Fuzzy Calendar
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Plan your goals and tasks across multiple months with smart tags and categories.
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Manage Tags
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-8">
        {selectedMonth === null ? (
          <div className="space-y-8">
            {/* Stats Card */}
            <Card className="p-6 bg-card shadow-card">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Your Calendar Overview
                  </h2>
                  <p className="text-muted-foreground">
                    You have <span className="font-semibold text-primary">{items.length}</span> items 
                    {items.length === 1 ? '' : 's'} and <span className="font-semibold text-accent">{tags.length}</span> tags
                  </p>
                </div>
                <Button 
                  onClick={handleAddItem}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-soft"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Item
                </Button>
              </div>
            </Card>

            {/* Tag Filter */}
            <TagFilter
              categoryTags={categoryTags}
              calendarTags={calendarTags}
              selectedTagIds={selectedTagIds}
              onTagSelect={handleTagSelect}
              onClearFilter={handleClearFilter}
            />

            {/* Month Grid */}
            <MonthGrid
              selectedMonth={selectedMonth}
              onMonthSelect={handleMonthSelect}
              getItemsForMonth={getItemsForMonthWithTags}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Month View Header */}
            <Card className="p-6 bg-card shadow-card">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedMonth(null)}
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Calendar
                  </Button>
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      {MONTHS[selectedMonth]}
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedMonthItems.length} {selectedMonthItems.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleAddItem}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-soft"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </Card>

            {/* Items List */}
            <ItemsList
              items={selectedMonthItems}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              categoryTags={categoryTags}
              calendarTags={calendarTags}
            />
          </div>
        )}
          </TabsContent>

          <TabsContent value="tags" className="space-y-6">
            {/* Tags Management Header */}
            <Card className="p-6 bg-card shadow-card">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Manage Tags
                  </h2>
                  <p className="text-muted-foreground">
                    Create categories and calendar tags to organize your items better
                  </p>
                </div>
                <Button 
                  onClick={handleAddTag}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-soft"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Tag
                </Button>
              </div>
            </Card>

            {/* Tags List */}
            <TagsList
              tags={tags}
              onEdit={handleEditTag}
              onDelete={handleDeleteTag}
            />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <ItemModal
          isOpen={isItemModalOpen}
          onClose={() => setIsItemModalOpen(false)}
          onSave={handleSaveItem}
          onUpdate={handleUpdateItem}
          editingItem={editingItem}
          categoryTags={categoryTags}
          calendarTags={calendarTags}
          getMonthsFromCalendarTags={getMonthsFromCalendarTags}
          preselectedMonth={selectedMonth}
        />
        
        <TagModal
          isOpen={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
          onSave={handleSaveTag}
          onUpdate={handleUpdateTag}
          editingTag={editingTag}
        />
      </div>
    </div>
  );
};

export default Index;