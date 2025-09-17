import React, { useState } from 'react';
import { Tag } from '@/types/item';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { MONTHS } from '@/types/item';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tag: Omit<Tag, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, updates: Partial<Omit<Tag, 'id' | 'createdAt'>>) => void;
  editingTag?: Tag | null;
}

export function TagModal({ isOpen, onClose, onSave, onUpdate, editingTag }: TagModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'category' | 'calendar'>('category');
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);

  const resetForm = () => {
    setName('');
    setType('category');
    setSelectedMonths([]);
  };

  const loadEditingTag = () => {
    if (editingTag) {
      setName(editingTag.name);
      setType(editingTag.type);
      setSelectedMonths(editingTag.months || []);
    } else {
      resetForm();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      loadEditingTag();
    }
  }, [editingTag, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tagData = {
      name: name.trim(),
      type,
      ...(type === 'calendar' && selectedMonths.length > 0 && { months: selectedMonths }),
    };

    if (editingTag && onUpdate) {
      onUpdate(editingTag.id, tagData);
    } else {
      onSave(tagData);
    }

    onClose();
    resetForm();
  };

  const handleMonthToggle = (monthIndex: number) => {
    setSelectedMonths(prev => 
      prev.includes(monthIndex)
        ? prev.filter(m => m !== monthIndex)
        : [...prev, monthIndex].sort()
    );
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {editingTag ? 'Edit Tag' : 'Create New Tag'}
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
            <Label htmlFor="tag-name" className="text-sm font-medium">
              Tag Name *
            </Label>
            <Input
              id="tag-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tag name..."
              className="bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Tag Type *</Label>
            <Select value={type} onValueChange={(value: 'category' | 'calendar') => setType(value)}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="calendar">Calendar Tag</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {type === 'category' 
                ? 'Categories help organize items by type (e.g., Work, Travel)'
                : 'Calendar tags map to specific months (e.g., Q1, Summer)'
              }
            </p>
          </div>

          {type === 'calendar' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Select Months * ({selectedMonths.length} selected)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto p-2 border border-border rounded-md bg-background">
                {MONTHS.map((month, index) => (
                  <div key={month} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-month-${index}`}
                      checked={selectedMonths.includes(index)}
                      onCheckedChange={() => handleMonthToggle(index)}
                    />
                    <Label 
                      htmlFor={`tag-month-${index}`} 
                      className="text-sm cursor-pointer hover:text-primary transition-colors"
                    >
                      {month}
                    </Label>
                  </div>
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
              disabled={!name.trim() || (type === 'calendar' && selectedMonths.length === 0)}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              {editingTag ? 'Update Tag' : 'Create Tag'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}