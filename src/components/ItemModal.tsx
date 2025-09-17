import { useState, useEffect } from 'react';
import { CalendarItem, MONTHS, Tag } from '@/types/item';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Hash, Calendar } from 'lucide-react';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<CalendarItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (id: string, updates: Partial<Omit<CalendarItem, 'id' | 'createdAt'>>) => void;
  editingItem?: CalendarItem | null;
  categoryTags: Tag[];
  calendarTags: Tag[];
  getMonthsFromCalendarTags: (tagIds: string[]) => number[];
}

export function ItemModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onUpdate, 
  editingItem, 
  categoryTags, 
  calendarTags, 
  getMonthsFromCalendarTags 
}: ItemModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedCategoryTags, setSelectedCategoryTags] = useState<string[]>([]);
  const [selectedCalendarTags, setSelectedCalendarTags] = useState<string[]>([]);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description);
      setSelectedMonths(editingItem.months);
      setSelectedCategoryTags(editingItem.categoryTags || []);
      setSelectedCalendarTags(editingItem.calendarTags || []);
    } else {
      setName('');
      setDescription('');
      setSelectedMonths([]);
      setSelectedCategoryTags([]);
      setSelectedCalendarTags([]);
    }
  }, [editingItem, isOpen]);

  // Get all months from calendar tags
  const monthsFromCalendarTags = getMonthsFromCalendarTags(selectedCalendarTags);
  const allSelectedMonths = [...new Set([...selectedMonths, ...monthsFromCalendarTags])].sort();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const itemData = {
      name: name.trim(),
      description: description.trim(),
      months: selectedMonths,
      categoryTags: selectedCategoryTags,
      calendarTags: selectedCalendarTags,
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

  const handleCategoryTagToggle = (tagId: string) => {
    setSelectedCategoryTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      }
      if (prev.length >= 5) return prev; // Max 5 category tags
      return [...prev, tagId];
    });
  };

  const handleCalendarTagToggle = (tagId: string) => {
    setSelectedCalendarTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      }
      if (prev.length >= 5) return prev; // Max 5 calendar tags
      return [...prev, tagId];
    });
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedMonths([]);
    setSelectedCategoryTags([]);
    setSelectedCalendarTags([]);
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
              Direct Month Assignment ({selectedMonths.length} selected)
            </Label>
            <p className="text-xs text-muted-foreground">
              Select months to directly assign this item to. Calendar tags will add additional months automatically.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[150px] overflow-y-auto p-2 border border-border rounded-md bg-background">
              {MONTHS.map((month, index) => {
                const isFromCalendarTag = monthsFromCalendarTags.includes(index);
                return (
                  <div key={month} className="flex items-center space-x-2">
                    <Checkbox
                      id={`month-${index}`}
                      checked={selectedMonths.includes(index) || isFromCalendarTag}
                      onCheckedChange={() => !isFromCalendarTag && handleMonthToggle(index)}
                      disabled={isFromCalendarTag}
                    />
                    <Label 
                      htmlFor={`month-${index}`} 
                      className={`text-sm cursor-pointer transition-colors ${
                        isFromCalendarTag 
                          ? 'text-muted-foreground' 
                          : 'hover:text-primary'
                      }`}
                    >
                      {month}
                      {isFromCalendarTag && <span className="text-xs text-accent ml-1">(from tag)</span>}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Tags */}
          {categoryTags.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                Category Tags ({selectedCategoryTags.length}/5)
              </Label>
              <div className="flex flex-wrap gap-2 p-2 border border-border rounded-md bg-background min-h-[60px]">
                {categoryTags.map((tag) => {
                  const isSelected = selectedCategoryTags.includes(tag.id);
                  const canSelect = selectedCategoryTags.length < 5 || isSelected;
                  return (
                    <Badge
                      key={tag.id}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        canSelect ? 'hover:bg-primary hover:text-primary-foreground' : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => canSelect && handleCategoryTagToggle(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Calendar Tags */}
          {calendarTags.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent" />
                Calendar Tags ({selectedCalendarTags.length}/5)
              </Label>
              <p className="text-xs text-muted-foreground">
                Calendar tags automatically add their months to this item.
              </p>
              <div className="flex flex-wrap gap-2 p-2 border border-border rounded-md bg-background min-h-[60px]">
                {calendarTags.map((tag) => {
                  const isSelected = selectedCalendarTags.includes(tag.id);
                  const canSelect = selectedCalendarTags.length < 5 || isSelected;
                  return (
                    <Badge
                      key={tag.id}
                      variant={isSelected ? "secondary" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        canSelect ? 'hover:bg-accent hover:text-accent-foreground' : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => canSelect && handleCalendarTagToggle(tag.id)}
                    >
                      {tag.name}
                      {tag.months && (
                        <span className="ml-1 text-xs opacity-70">
                          ({tag.months.length}m)
                        </span>
                      )}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Preview of all selected months */}
          {allSelectedMonths.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Total Selected Months ({allSelectedMonths.length})
              </Label>
              <div className="flex flex-wrap gap-1 p-2 border border-border rounded-md bg-muted">
                {allSelectedMonths.map((monthIndex) => (
                  <Badge key={monthIndex} variant="outline" className="text-xs">
                    {MONTHS[monthIndex]}
                  </Badge>
                ))}
              </div>
            </div>
          )}

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
              disabled={!name.trim()}
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