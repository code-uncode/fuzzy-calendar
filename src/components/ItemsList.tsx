import { CalendarItem, MONTHS, Tag } from '@/types/item';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Hash, Calendar } from 'lucide-react';

interface ItemsListProps {
  items: CalendarItem[];
  onEdit: (item: CalendarItem) => void;
  onDelete: (id: string) => void;
  categoryTags: Tag[];
  calendarTags: Tag[];
}

export function ItemsList({ items, onEdit, onDelete, categoryTags, calendarTags }: ItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No items for this month yet.</p>
        <p className="text-muted-foreground text-sm mt-2">Add some goals or tasks to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const itemCategoryTags = categoryTags.filter(tag => item.categoryTags?.includes(tag.id));
        const itemCalendarTags = calendarTags.filter(tag => item.calendarTags?.includes(tag.id));
        
        return (
          <Card key={item.id} className="p-6 bg-card shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-2 truncate">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}
                
                {/* Tags Section */}
                <div className="space-y-2 mb-3">
                  {itemCategoryTags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Hash className="h-3 w-3 text-primary flex-shrink-0" />
                      {itemCategoryTags.map((tag) => (
                        <Badge key={tag.id} variant="default" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {itemCalendarTags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Calendar className="h-3 w-3 text-accent flex-shrink-0" />
                      {itemCalendarTags.map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Direct Month Assignments */}
                {item.months.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-muted-foreground mr-2">Direct:</span>
                    {item.months.map((monthIndex) => (
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
                  onClick={() => onEdit(item)}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}