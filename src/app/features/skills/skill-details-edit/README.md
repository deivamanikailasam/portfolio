# Skill Details Edit Component

## Overview
This component provides a modern, user-friendly interface to manage skill details for your portfolio. It allows you to add, edit, delete, and reorder skills for different technologies.

## Features
- **Technology Dropdown**: Select from available technologies (JavaScript, Angular, React, Next.js, etc.)
- **Add Skills**: Add new skill descriptions with HTML formatting support
- **Edit Skills**: Inline editing of existing skills
- **Delete Skills**: Remove skills with confirmation
- **Reorder Skills**: Move skills up/down to change their order
- **Save Changes**: Persist changes to local storage and optionally to production

## How to Use

### Accessing the Component
Navigate to `/skill-details-edit` in your application.

### Managing Skills

1. **Select a Technology**
   - Use the dropdown at the top to select a technology
   - The skills for that technology will load automatically

2. **Add a New Skill**
   - Enter the skill description in the "Add New Skill" textarea
   - You can use HTML tags like `<strong>` for emphasis
   - Click "Add Skill" to add it to the list

3. **Edit an Existing Skill**
   - Click the pencil icon (✏️) on any skill
   - Modify the text in the textarea
   - Click "Save" to confirm or "Cancel" to discard

4. **Delete a Skill**
   - Click the trash icon (🗑️) on any skill
   - Confirm the deletion in the popup dialog

5. **Reorder Skills**
   - Use the up (↑) and down (↓) arrows to move skills
   - This changes the display order

6. **Save Changes**
   - Click "Save Changes" in the header
   - Changes are saved to local storage
   - A JSON file is automatically downloaded for manual replacement

## Data Persistence

### Local Development
- Changes are saved to `localStorage` for immediate persistence
- A JSON file is automatically downloaded
- Replace `src/assets/data/skill-details.json` with the downloaded file
- Restart your development server to see changes reflected

### Production
- To enable automatic API updates, set `apiUrl` in environment files:
  ```typescript
  // src/environments/environment.prod.ts
  export const environment = {
    production: true,
    apiUrl: 'https://your-api-endpoint.com'
  };
  ```
- The service will POST/PUT to `${apiUrl}/skill-details`

## Technical Details

### Component Files
- `skill-details-edit.component.ts` - Component logic
- `skill-details-edit.component.html` - Template
- `skill-details-edit.component.scss` - Styles (matching skill-details design)

### Services Used
- `ContentService` - Loads and manages portfolio content
- `SkillDataService` - Handles CRUD operations for skill data

### Dependencies
- PrimeNG components:
  - `DropdownModule` - Technology selector
  - `InputTextareaModule` - Text input areas
  - `ButtonModule` - Action buttons
  - `ConfirmDialogModule` - Deletion confirmations
  - `ToastModule` - Success/error notifications

## HTML Formatting

Skills support HTML formatting for rich text display:
- `<strong>` - Bold text
- `<em>` - Italic text
- `<code>` - Code snippets

Example:
```html
Expert-level understanding of <strong>Promises</strong>, <strong>async/await</strong> syntax, and their relationship to the JavaScript concurrency model
```

## Styling

The component uses the same modern design system as the skill-details page:
- Soft color palette with indigo, pink, and green accents
- Animated gradient background
- Glass morphism effects
- Smooth transitions and hover states
- Fully responsive design

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires localStorage support
- Responsive design for mobile and tablet

## Future Enhancements
- [ ] Bulk operations (delete multiple, reorder multiple)
- [ ] Import/Export functionality
- [ ] Version history
- [ ] Collaborative editing
- [ ] Rich text editor with preview

