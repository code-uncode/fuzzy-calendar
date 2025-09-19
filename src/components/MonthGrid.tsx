import { MONTHS, Tag } from '@/types/item';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MonthGridProps {
  selectedMonth: number | null;
  onMonthSelect: (month: number) => void;
  getItemsForMonth: (month: number) => any[];
  getTagCountsForMonth: (month: number) => { tag: Tag; count: number }[];
}

export function MonthGrid({ selectedMonth, onMonthSelect, getItemsForMonth, getTagCountsForMonth }: MonthGridProps) {
  const currentMonth = new Date().getMonth();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {MONTHS.map((month, index) => {
        const itemCount = getItemsForMonth(index).length;
        const tagCounts = getTagCountsForMonth(index);
        const isSelected = selectedMonth === index;
        const isCurrent = index === currentMonth;
        
        return (
          <Card
            key={month}
            className={`
              relative p-4 cursor-pointer transition-all duration-300 hover:shadow-soft hover:-translate-y-1
              ${isSelected 
                ? 'bg-gradient-primary text-primary-foreground shadow-soft scale-105' 
                : isCurrent
                ? 'bg-accent/20 border-accent hover:bg-accent/30'
                : 'bg-card hover:bg-secondary/50'
              }
            `}
            onClick={() => onMonthSelect(index)}
          >
            <div className="text-center space-y-2">
              <h3 className={`text-lg font-semibold ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                {month}
              </h3>
              
              {itemCount > 0 ? (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </div>
                  
                  {tagCounts.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {tagCounts.slice(0, 4).map(({ tag, count }) => (
                        <Badge
                          key={tag.id}
                          className="text-xs px-1.5 py-0.5"
                          style={{
                            backgroundColor: `hsl(${tag.color})`,
                            color: 'white'
                          }}
                        >
                          {count}
                        </Badge>
                      ))}
                      {tagCounts.length > 4 && (
                        <Badge className="text-xs px-1.5 py-0.5 bg-muted-foreground">
                          +{tagCounts.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">No items</div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}