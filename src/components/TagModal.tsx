import React, { useState } from 'react';
import { Tag, TAG_COLORS } from '@/types/item';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, AlertCircle } from 'lucide-react';
import { MONTHS } from '@/types/item';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tag: Omit<Tag, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, updates: Partial<Omit<Tag, 'id' | 'createdAt'>>) => void;
  editingTag?: Tag | null;
  existingTags?: Tag[];
}

export function TagModal({ isOpen, onClose, onSave, onUpdate, editingTag, existingTags = [] }: TagModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'category' | 'calendar'>('category');
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(TAG_COLORS[0].value);
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setType('category');
    setSelectedMonths([]);
    setSelectedColor(TAG_COLORS[0].value);
    setError('');
  };

  const loadEditingTag = () => {
    if (editingTag) {
      setName(editingTag.name);
      setType(editingTag.type);
      setSelectedMonths(editingTag.months || []);
      setSelectedColor(editingTag.color);
    } else {
      resetForm();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      loadEditingTag();
    }
  }, [editingTag, isOpen]);

  const checkDuplicateName = (tagName: string) => {
    const trimmedName = tagName.toLowerCase().trim();
    return existingTags.some(tag => 
      tag.id !== editingTag?.id && 
      tag.name.toLowerCase().trim() === trimmedName
    );
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (error && !checkDuplicateName(value)) {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Check for duplicate names
    if (checkDuplicateName(name)) {
      setError('A tag with this name already exists');
      return;
    }

    const tagData = {
      name: name.trim(),
      type,
      color: selectedColor,
      ...(type === 'calendar' && selectedMonths.length > 0 && { months: selectedMonths }),
    };

    try {
      if (editingTag && onUpdate) {
        onUpdate(editingTag.id, tagData);
      } else {
        onSave(tagData);
      }
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
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
      <DialogContent className="sm:max-w-[500px] bg-card animate-scale-in max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {editingTag ? 'Edit Tag' : 'Create New Tag'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="tag-name" className="text-sm font-medium">
              Tag Name *
            </Label>
            <Input
              id="tag-name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
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

          <div className="space-y-3">
            <Label className="text-sm font-medium">Tag Color *</Label>
            <div className="grid grid-cols-6 gap-2">
              {TAG_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all hover:scale-110
                    ${selectedColor === color.value 
                      ? 'border-foreground scale-110 shadow-lg' 
                      : 'border-border hover:border-muted-foreground'
                    }
                  `}
                  style={{ backgroundColor: `hsl(${color.value})` }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.name}
                />
              ))}
            </div>
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