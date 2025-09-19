import { useState, useEffect } from 'react';
import { Tag } from '@/types/item';

const TAGS_STORAGE_KEY = 'tags';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);

  // Load tags from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TAGS_STORAGE_KEY);
      if (stored) {
        const parsedTags = JSON.parse(stored).map((tag: any) => ({
          ...tag,
          createdAt: new Date(tag.createdAt),
        }));
        setTags(parsedTags);
      }
    } catch (error) {
      console.error('Error loading tags from localStorage:', error);
    }
  }, []);

  // Save tags to localStorage whenever tags change
  useEffect(() => {
    try {
      localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
    } catch (error) {
      console.error('Error saving tags to localStorage:', error);
    }
  }, [tags]);

  const addTag = (tag: Omit<Tag, 'id' | 'createdAt'>) => {
    // Check for duplicate names
    const isDuplicate = tags.some(existingTag => 
      existingTag.name.toLowerCase().trim() === tag.name.toLowerCase().trim()
    );
    
    if (isDuplicate) {
      throw new Error('A tag with this name already exists');
    }

    const newTag: Tag = {
      ...tag,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTags(prev => [...prev, newTag]);
    return newTag;
  };

  const updateTag = (id: string, updates: Partial<Omit<Tag, 'id' | 'createdAt'>>) => {
    // Check for duplicate names if name is being updated
    if (updates.name) {
      const isDuplicate = tags.some(existingTag => 
        existingTag.id !== id && 
        existingTag.name.toLowerCase().trim() === updates.name!.toLowerCase().trim()
      );
      
      if (isDuplicate) {
        throw new Error('A tag with this name already exists');
      }
    }

    setTags(prev =>
      prev.map(tag =>
        tag.id === id ? { ...tag, ...updates } : tag
      )
    );
  };

  const deleteTag = (id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
  };

  const getCategoryTags = () => tags.filter(tag => tag.type === 'category');
  const getCalendarTags = () => tags.filter(tag => tag.type === 'calendar');

  const getMonthsFromCalendarTags = (calendarTagIds: string[]) => {
    const calendarTags = tags.filter(tag => 
      tag.type === 'calendar' && calendarTagIds.includes(tag.id)
    );
    const months = new Set<number>();
    calendarTags.forEach(tag => {
      tag.months?.forEach(month => months.add(month));
    });
    return Array.from(months).sort();
  };

  return {
    tags,
    addTag,
    updateTag,
    deleteTag,
    getCategoryTags,
    getCalendarTags,
    getMonthsFromCalendarTags,
  };
}