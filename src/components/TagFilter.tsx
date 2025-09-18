import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tag } from '@/types/item';
import { X, Filter } from 'lucide-react';

interface TagFilterProps {
  categoryTags: Tag[];
  calendarTags: Tag[];
  selectedTagIds: string[];
  onTagSelect: (tagId: string) => void;
  onClearFilter: () => void;
}

export function TagFilter({ 
  categoryTags, 
  calendarTags, 
  selectedTagIds, 
  onTagSelect, 
  onClearFilter 
}: TagFilterProps) {
  const hasActiveFilters = selectedTagIds.length > 0;

  if (categoryTags.length === 0 && calendarTags.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-card shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-foreground">Filter by Tags</h3>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilter}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {categoryTags.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categoryTags.map(tag => (
                <Badge
                  key={tag.id}
                  variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onTagSelect(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {calendarTags.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Calendar Tags</p>
            <div className="flex flex-wrap gap-2">
              {calendarTags.map(tag => (
                <Badge
                  key={tag.id}
                  variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onTagSelect(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing items with {selectedTagIds.length} selected tag{selectedTagIds.length === 1 ? '' : 's'}
          </p>
        </div>
      )}
    </Card>
  );
}