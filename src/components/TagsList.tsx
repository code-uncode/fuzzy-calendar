import { Tag } from '@/types/item';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Hash, Calendar } from 'lucide-react';
import { MONTHS } from '@/types/item';

interface TagsListProps {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
}

export function TagsList({ tags, onEdit, onDelete }: TagsListProps) {
  const categoryTags = tags.filter(tag => tag.type === 'category');
  const calendarTags = tags.filter(tag => tag.type === 'calendar');

  if (tags.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No tags created yet.</p>
        <p className="text-muted-foreground text-sm mt-2">Create tags to organize your items better!</p>
      </div>
    );
  }

  const TagCard = ({ tag }: { tag: Tag }) => (
    <Card key={tag.id} className="p-4 bg-card shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {tag.type === 'category' ? (
              <Hash className="h-4 w-4 text-primary" />
            ) : (
              <Calendar className="h-4 w-4 text-accent" />
            )}
            <h3 className="text-lg font-semibold text-foreground truncate">
              {tag.name}
            </h3>
            <Badge variant={tag.type === 'category' ? 'default' : 'secondary'} className="text-xs">
              {tag.type}
            </Badge>
          </div>
          {tag.type === 'calendar' && tag.months && tag.months.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tag.months.map((monthIndex) => (
                <Badge key={monthIndex} variant="outline" className="text-xs">
                  {MONTHS[monthIndex]}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(tag)}
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(tag.id)}
            className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {categoryTags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Hash className="h-5 w-5 text-primary" />
            Categories ({categoryTags.length})
          </h3>
          <div className="grid gap-3">
            {categoryTags.map((tag) => (
              <TagCard key={tag.id} tag={tag} />
            ))}
          </div>
        </div>
      )}

      {calendarTags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            Calendar Tags ({calendarTags.length})
          </h3>
          <div className="grid gap-3">
            {calendarTags.map((tag) => (
              <TagCard key={tag.id} tag={tag} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}