export interface Tag {
  id: string;
  name: string;
  type: 'category' | 'calendar';
  months?: number[]; // Only for calendar tags
  createdAt: Date;
}

export interface CalendarItem {
  id: string;
  name: string;
  description: string;
  months: number[]; // Directly assigned months
  categoryTags: string[]; // Tag IDs, max 5
  calendarTags: string[]; // Tag IDs, max 5
  createdAt: Date;
  updatedAt: Date;
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;