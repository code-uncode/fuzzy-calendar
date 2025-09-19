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
    <Card className="p-3 bg-card shadow-card">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-foreground text-sm">Filter Tags</h3>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilter}
            className="text-xs h-7 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {categoryTags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Categories</h4>
            <div className="flex flex-wrap gap-1">
              {categoryTags.map(tag => (
                <Badge
                  key={tag.id}
                  variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer hover:opacity-80 transition-opacity text-xs h-6"
                  style={{
                    backgroundColor: selectedTagIds.includes(tag.id) ? `hsl(${tag.color})` : undefined,
                    borderColor: `hsl(${tag.color})`,
                    color: selectedTagIds.includes(tag.id) ? 'white' : `hsl(${tag.color})`
                  }}
                  onClick={() => onTagSelect(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {calendarTags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Calendar Tags</h4>
            <div className="flex flex-wrap gap-1">
              {calendarTags.map(tag => (
                <Badge
                  key={tag.id}
                  variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer hover:opacity-80 transition-opacity text-xs h-6"
                  style={{
                    backgroundColor: selectedTagIds.includes(tag.id) ? `hsl(${tag.color})` : undefined,
                    borderColor: `hsl(${tag.color})`,
                    color: selectedTagIds.includes(tag.id) ? 'white' : `hsl(${tag.color})`
                  }}
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
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {selectedTagIds.length} tag{selectedTagIds.length === 1 ? '' : 's'} selected
          </p>
        </div>
      )}
    </Card>
  );
}