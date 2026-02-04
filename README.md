# Fuzzy Calendar

A flexible calendar planning application that helps you organize goals and tasks across multiple months using smart tagging and categorization.
This project has been created with the help of Lovable. It is hosted at [Fuzzy Calendar](https://fuzzy-calendar.lovable.app)

## Features

### 📅 Multi-Month Planning
- View all 12 months at a glance in a responsive grid layout
- Assign items to one or multiple months for flexible scheduling
- See item counts and tag distributions per month

### 🏷️ Smart Tagging System
- **Category Tags**: Organize items by type (e.g., Work, Personal, Health)
- **Calendar Tags**: Create recurring schedules by assigning months to tags (e.g., "Q1" tag for Jan-Mar)
- **Color Coding**: Choose from 12 distinct colors for easy visual identification
- **Unique Tags**: Duplicate tag names are prevented automatically

### 🔍 Powerful Filtering
- Filter items by one or multiple tags
- Visual indicator when filters are active
- Clear distinction between category and calendar tags in filter UI
- Quick clear-all filter option

### 📝 Item Management
- Create items with names, descriptions, and multiple tag assignments
- Assign items directly to months or inherit months from calendar tags
- Edit and delete items with confirmation
- Maximum of 5 category tags and 5 calendar tags per item

### 📊 Overview Dashboard
- Total item count display
- Tag-based item counts with color-coded badges
- Per-month tag distribution in calendar grid

## Technology Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Local Storage** - Data persistence


## Usage

1. **Create Tags**: Go to "Manage Tags" tab to create category or calendar tags with your preferred colors
2. **Add Items**: Click "Add New Item" to create tasks/goals with descriptions and tag assignments
3. **Navigate**: Click on any month to see items scheduled for that period
4. **Filter**: Use the tag filter to focus on specific categories or calendar periods

## Data Storage

All data is stored locally in your browser's localStorage. Your items and tags persist between sessions but are not synced across devices.

## License

This project is open source and available under the MIT License.
