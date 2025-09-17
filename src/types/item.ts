export interface CalendarItem {
  id: string;
  name: string;
  description: string;
  months: number[]; // Array of month numbers (0-11)
  createdAt: Date;
  updatedAt: Date;
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;