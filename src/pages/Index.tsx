import { useState } from 'react';
import { useItems } from '@/hooks/useItems';
import { MonthGrid } from '@/components/MonthGrid';
import { ItemsList } from '@/components/ItemsList';
import { ItemModal } from '@/components/ItemModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CalendarItem, MONTHS } from '@/types/item';
import { Plus, Calendar, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { items, addItem, updateItem, deleteItem, getItemsForMonth } = useItems();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CalendarItem | null>(null);
  const { toast } = useToast();

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: CalendarItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
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

  const selectedMonthItems = selectedMonth !== null ? getItemsForMonth(selectedMonth) : [];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Fuzzy Calendar
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Plan your goals and tasks across multiple months. Create items and assign them to the months they matter most.
          </p>
        </div>

        {/* Main Content */}
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
                    {items.length === 1 ? '' : 's'} planned across your calendar
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

            {/* Month Grid */}
            <MonthGrid
              selectedMonth={selectedMonth}
              onMonthSelect={handleMonthSelect}
              getItemsForMonth={getItemsForMonth}
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
            />
          </div>
        )}

        {/* Item Modal */}
        <ItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
          onUpdate={handleUpdateItem}
          editingItem={editingItem}
        />
      </div>
    </div>
  );
};

export default Index;