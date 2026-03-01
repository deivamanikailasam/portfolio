# Experience Details Edit Component

A modern, feature-rich component for managing experience details in the portfolio application.

## Overview

The Experience Details Edit Component provides a complete CRUD (Create, Read, Update, Delete) interface for managing experience entries. It features a sleek, modern design with animated backgrounds, rich text editing capabilities, and seamless data persistence.

## Features

### Core Functionality
- **Technology Selection**: Dropdown selector populated dynamically from portfolio data
- **Add Experiences**: Rich text editor for adding new experience entries
- **Edit Experiences**: In-place editing with rich text formatting
- **Delete Experiences**: Confirmation dialog before deletion
- **Reorder Experiences**: Move experiences up/down in the list
- **Auto-save**: Changes are automatically saved to localStorage and can be exported

### UI/UX Features
- **Modern Glass-morphism Design**: Translucent cards with backdrop blur effects
- **Animated Background**: Dynamic gradient orbs creating a fluid, engaging atmosphere
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Responsive Layout**: Adapts to different screen sizes
- **Loading States**: Visual feedback during data operations
- **Toast Notifications**: User-friendly success/error messages

### Technical Features
- **Angular Signals**: Reactive state management
- **PrimeNG Components**: Select (dropdown), Editor (rich text), Toast, ConfirmDialog
- **Rich Text Editing**: Full formatting capabilities (bold, italic, lists, etc.)
- **Dynamic Data Loading**: Technologies loaded from `db.json`
- **Dual Persistence**: Local storage + file download for production deployment

## Usage

### Navigation

Navigate to the component using Angular Router:

```typescript
this.router.navigate(['/experience-details-edit']);
```

Or directly via URL:
```
http://localhost:4200/experience-details-edit
```

### Workflow

1. **Select Technology**: Choose a technology from the dropdown
2. **View Current Experiences**: See all experiences for that technology
3. **Add New Experience**: Use the rich text editor and click "Add Experience"
4. **Edit Existing**: Click the edit button on any experience
5. **Reorder**: Use up/down arrows to change order
6. **Delete**: Click delete button (with confirmation)
7. **Save Changes**: Click "Save Changes" to persist

## Data Structure

### Input: experience-details.json

```json
{
  "js": [
    "Built <strong>complex single-page applications</strong> using vanilla JavaScript",
    "Developed <strong>reusable libraries</strong> and utility functions"
  ],
  "angular": [
    "Led development of <strong>enterprise-scale applications</strong>",
    "Architected <strong>modular Angular applications</strong>"
  ]
}
```

### Technology Loading

Technologies are dynamically loaded from `db.json`:
```typescript
portfolioContent.skills → subdivisions → items → { key, name }
```

Example:
- `key: "angular"` → used as experience-details.json key
- `name: "Angular"` → displayed in dropdown

## Component Architecture

### Signals (Reactive State)

```typescript
technologies = signal<Technology[]>([]);      // Available technologies
selectedTechnology = signal<string>('');       // Currently selected tech
experiences = signal<string[]>([]);            // Experience list
editingIndex = signal<number>(-1);             // Currently editing index
editingExperience = signal<string>('');        // Editing content
newExperience = signal<string>('');            // New experience input
isLoading = signal<boolean>(false);            // Loading state
isSaving = signal<boolean>(false);             // Saving state
```

### Services

#### ContentService
- `loadPortfolioContent()`: Loads portfolio data from db.json
- `loadExperienceDetails()`: Loads experience-details.json
- `experienceDetails`: Signal containing all experience data

#### SkillDataService
- `saveExperienceDetails(data)`: Saves to localStorage and triggers download

### Methods

| Method | Description |
|--------|-------------|
| `loadExperienceDetails()` | Load and parse data from ContentService |
| `onTechnologyChange()` | Handle technology selection |
| `addExperience()` | Add new experience to list |
| `startEdit(index)` | Enter edit mode for experience |
| `saveEdit()` | Save edited experience |
| `cancelEdit()` | Cancel editing |
| `deleteExperience(index)` | Delete experience with confirmation |
| `moveUp(index)` | Move experience up in list |
| `moveDown(index)` | Move experience down in list |
| `saveChanges()` | Persist changes to storage |
| `goBack()` | Navigate to home |

## Styling

### SCSS Structure

- **Container**: Main wrapper with overflow handling
- **Animated Background**: Three gradient orbs with animations
- **Header**: Title, badge, back button, save button
- **Content**: Technology selector, add form, experiences list
- **Experiences List**: Card-based layout with actions
- **Editor**: Custom-styled PrimeNG Editor component

### Color Scheme

- Primary: `#6366f1` (Indigo)
- Success: `#6ee7b7` (Green)
- Danger: `#f87171` (Red)
- Warning: `#fbbf24` (Yellow)
- Background: Dark gradients with transparency

### Key CSS Features

- Glass-morphism effects
- Smooth transitions (cubic-bezier timing)
- Hover states with transform animations
- Backdrop filters
- Custom PrimeNG overrides

## Dependencies

### PrimeNG Components
```typescript
import { Select } from 'primeng/select';
import { Editor } from 'primeng/editor';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
```

### Services
```typescript
import { ConfirmationService, MessageService } from 'primeng/api';
```

### Required Installation
```bash
npm install quill  # Required for PrimeNG Editor
```

## Integration

### Routes Configuration (app.routes.ts)

```typescript
{
  path: 'experience-details-edit',
  component: ExperienceDetailsEditComponent
}
```

### App Config (app.config.ts)

Ensure animations are enabled:
```typescript
provideAnimationsAsync()
```

## Data Persistence

### Local Development

1. **localStorage**: Changes are immediately saved to browser storage
2. **File Download**: JSON file is automatically downloaded
3. **Manual Update**: Replace `src/assets/data/experience-details.json` with downloaded file

### Production

If `environment.apiUrl` is set:
- Changes are sent to backend via HTTP PUT
- Endpoint: `${apiUrl}/experience-details`

## Error Handling

- **No Technology Selected**: Disabled add/edit/save actions
- **Empty Experience**: Disabled add/save buttons
- **Network Errors**: Toast notification with error message
- **Loading States**: Visual feedback during operations

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support (via PrimeNG)
- Focus management
- Screen reader friendly

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript features
- CSS Grid and Flexbox

## Performance Optimizations

- Angular Signals for fine-grained reactivity
- Computed signals for derived state
- OnPush change detection (via signals)
- Lazy-loaded PrimeNG modules
- Efficient list rendering with @for trackBy

## Future Enhancements

- [ ] Search/filter experiences
- [ ] Bulk operations (select multiple, bulk delete)
- [ ] Drag-and-drop reordering
- [ ] Experience templates
- [ ] Version history/undo-redo
- [ ] Export to different formats (PDF, Word)
- [ ] Import from existing resume files

## Troubleshooting

### Dropdown Not Showing Items
- Ensure `db.json` is properly loaded
- Check browser console for errors
- Verify portfolio data structure

### Editor Not Working
- Ensure `quill` is installed
- Check if animations are enabled in app config

### Save Not Working
- Check browser localStorage permissions
- Verify ContentService is properly injected
- Check network tab for API errors (if using backend)

## License

Part of the Deivamanikailasam Portfolio Application

