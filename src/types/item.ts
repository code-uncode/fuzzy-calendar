export interface Tag {
  id: string;
  name: string;
  type: 'category' | 'calendar';
  color: string;
  months?: number[]; // Only for calendar tags
  createdAt: Date;
}

export const TAG_COLORS = [
  { name: 'Blue', value: '210 100% 65%', class: 'bg-blue-500' },
  { name: 'Green', value: '142 76% 65%', class: 'bg-green-500' },
  { name: 'Purple', value: '270 76% 65%', class: 'bg-purple-500' },
  { name: 'Pink', value: '320 76% 65%', class: 'bg-pink-500' },
  { name: 'Orange', value: '25 95% 65%', class: 'bg-orange-500' },
  { name: 'Red', value: '0 84% 65%', class: 'bg-red-500' },
  { name: 'Teal', value: '178 76% 55%', class: 'bg-teal-500' },
  { name: 'Indigo', value: '234 76% 65%', class: 'bg-indigo-500' },
  { name: 'Yellow', value: '48 96% 65%', class: 'bg-yellow-500' },
  { name: 'Emerald', value: '160 76% 55%', class: 'bg-emerald-500' },
  { name: 'Cyan', value: '188 95% 65%', class: 'bg-cyan-500' },
  { name: 'Rose', value: '350 89% 65%', class: 'bg-rose-500' },
] as const;

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