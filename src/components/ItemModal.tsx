import { useState, useEffect } from 'react';
import { CalendarItem, MONTHS } from '@/types/item';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<CalendarItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (id: string, updates: Partial<Omit<CalendarItem, 'id' | 'createdAt'>>) => void;
  editingItem?: CalendarItem | null;
}

export function ItemModal({ isOpen, onClose, onSave, onUpdate, editingItem }: ItemModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description);
      setSelectedMonths(editingItem.months);
    } else {
      setName('');
      setDescription('');
      setSelectedMonths([]);
    }
  }, [editingItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedMonths.length === 0) return;

    const itemData = {
      name: name.trim(),
      description: description.trim(),
      months: selectedMonths,
    };

    if (editingItem && onUpdate) {
      onUpdate(editingItem.id, itemData);
    } else {
      onSave(itemData);
    }

    onClose();
  };

  const handleMonthToggle = (monthIndex: number) => {
    setSelectedMonths(prev => 
      prev.includes(monthIndex)
        ? prev.filter(m => m !== monthIndex)
        : [...prev, monthIndex].sort()
    );
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedMonths([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-card animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 h-8 w-8 p-0"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Item Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name..."
              className="bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)..."
              className="bg-background min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Select Months * ({selectedMonths.length} selected)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto p-2 border border-border rounded-md bg-background">
              {MONTHS.map((month, index) => (
                <div key={month} className="flex items-center space-x-2">
                  <Checkbox
                    id={`month-${index}`}
                    checked={selectedMonths.includes(index)}
                    onCheckedChange={() => handleMonthToggle(index)}
                  />
                  <Label 
                    htmlFor={`month-${index}`} 
                    className="text-sm cursor-pointer hover:text-primary transition-colors"
                  >
                    {month}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || selectedMonths.length === 0}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}