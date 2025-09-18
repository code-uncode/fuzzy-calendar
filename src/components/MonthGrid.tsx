import { MONTHS } from '@/types/item';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MonthGridProps {
  selectedMonth: number | null;
  onMonthSelect: (month: number) => void;
  getItemsForMonth: (month: number) => any[];
}

export function MonthGrid({ selectedMonth, onMonthSelect, getItemsForMonth }: MonthGridProps) {
  const currentMonth = new Date().getMonth();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {MONTHS.map((month, index) => {
        const itemCount = getItemsForMonth(index).length;
        const isSelected = selectedMonth === index;
        const isCurrent = index === currentMonth;
        
        return (
          <Card
            key={month}
            className={`
              relative p-6 cursor-pointer transition-all duration-300 hover:shadow-soft hover:-translate-y-1
              ${isSelected 
                ? 'bg-gradient-primary text-primary-foreground shadow-soft scale-105' 
                : isCurrent
                ? 'bg-accent/20 border-accent hover:bg-accent/30'
                : 'bg-card hover:bg-secondary/50'
              }
            `}
            onClick={() => onMonthSelect(index)}
          >
            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-2 ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                {month}
              </h3>
              {itemCount > 0 && (
                <Badge 
                  variant={isSelected ? "secondary" : "default"}
                  className={`text-xs ${isSelected ? 'bg-white/20 text-primary-foreground hover:bg-white/30' : ''}`}
                >
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </Badge>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}