import { useState, useEffect } from 'react';
import { CalendarItem } from '@/types/item';

const STORAGE_KEY = 'items';

export function useItems() {
  const [items, setItems] = useState<CalendarItem[]>([]);

  // Load items from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedItems = JSON.parse(stored).map((item: any) => ({
          ...item,
          categoryTags: item.categoryTags || [],
          calendarTags: item.calendarTags || [],
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
        setItems(parsedItems);
      }
    } catch (error) {
      console.error('Error loading items from localStorage:', error);
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving items to localStorage:', error);
    }
  }, [items]);

  const addItem = (item: Omit<CalendarItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: CalendarItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setItems(prev => [...prev, newItem]);
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<Omit<CalendarItem, 'id' | 'createdAt'>>) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date() }
          : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getItemsForMonth = (month: number, calendarTags: any[] = []) => {
    return items.filter(item => {
      // Direct month assignment
      if (item.months.includes(month)) return true;
      
      // Calendar tag assignment
      const itemCalendarTags = calendarTags.filter(tag => 
        item.calendarTags.includes(tag.id)
      );
      return itemCalendarTags.some(tag => tag.months?.includes(month));
    });
  };

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    getItemsForMonth,
  };
}