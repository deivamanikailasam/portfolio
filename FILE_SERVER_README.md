# File Server Setup

This document explains how to set up and use the local file server that allows the Angular application to save JSON files directly to the file system.

## Overview

The file server is a simple Express.js server that provides an API endpoint for writing files to the local file system. This is necessary because browsers cannot directly write to the file system due to security restrictions.

## Architecture

```
Angular App (Port 4200)
    ↓ HTTP POST
File Server (Port 3001)
    ↓ File System Write
src/assets/data/*.json
```

## Files

- **`file-server.js`**: Express server that handles file writing
- **`package.json`**: Updated with new scripts and dependencies

## Setup

### 1. Install Dependencies

The required dependencies (`express`, `cors`) are already added to `package.json` as devDependencies. They should be installed automatically when you run:

```bash
npm install
```

### 2. Start the Development Environment

**Option A: Start Everything Together (Recommended)**

```bash
npm run dev
```

This will start:
- Angular dev server on `http://localhost:4200`
- File server on `http://localhost:3001`

**Option B: Start Individually**

Terminal 1 (Angular):
```bash
npm start
```

Terminal 2 (File Server):
```bash
npm run file-server
```

### 3. Verify File Server is Running

Open your browser or use curl to check:

```bash
curl http://localhost:3001/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "File server is running",
  "port": 3001
}
```

## Usage

### Saving Files from Angular

The `SkillDataService` automatically uses the file server when saving:

```typescript
// This will call POST http://localhost:3001/api/save-file
await this.skillDataService.saveSkillDetails(skillDetails);
await this.skillDataService.saveExperienceDetails(experienceDetails);
```

### API Endpoint

**POST /api/save-file**

Request Body:
```json
{
  "path": "src/assets/data/skill-details.json",
  "content": "{\n  \"js\": [...],\n  \"angular\": [...]\n}"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "File saved successfully: src/assets/data/skill-details.json",
  "path": "/absolute/path/to/file"
}
```

Response (Error):
```json
{
  "error": "Failed to save file",
  "details": "Error message here"
}
```

## Security

The file server includes several security measures:

1. **Path Validation**: Only allows writing within the project directory
2. **CORS Enabled**: Allows requests only from the Angular dev server
3. **Size Limit**: JSON payload limited to 10MB
4. **Port Isolation**: Runs on a different port than the Angular app

## How It Works

### 1. User Edits Data
User makes changes in `skill-details-edit` or `experience-details-edit` components.

### 2. Save Button Clicked
Component calls `SkillDataService.saveSkillDetails()` or `saveExperienceDetails()`.

### 3. Service Makes API Call
Service sends POST request to `http://localhost:3001/api/save-file` with:
- File path (e.g., `src/assets/data/skill-details.json`)
- File content (JSON stringified with 2-space indentation)

### 4. Server Writes File
Express server:
- Validates the path is within project directory
- Creates directories if needed
- Writes the file to disk

### 5. Angular Reloads
Angular's dev server detects the file change and hot-reloads the application (if the file is imported).

## Troubleshooting

### File Server Not Starting

**Error**: `Cannot find module 'express'`

**Solution**: Install dependencies
```bash
npm install
```

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3001`

**Solution**: 
1. Find and kill the process using port 3001:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -i :3001
   kill -9 <PID>
   ```

2. Or change the port in `file-server.js`:
   ```javascript
   const PORT = 3002; // Change to available port
   ```

### CORS Errors

**Error**: `Access to fetch at 'http://localhost:3001/api/save-file' from origin 'http://localhost:4200' has been blocked by CORS policy`

**Solution**: The `cors()` middleware is already configured. Make sure:
1. File server is running
2. You're accessing from `http://localhost:4200` (not `127.0.0.1`)

### File Not Saving

**Check the console** for error messages:
- ❌ Error saving to file system
- 💡 Make sure the development server supports file writing API

**Common causes**:
1. File server not running → Start with `npm run file-server`
2. Wrong file path → Check path is relative to project root
3. Permission issues → Make sure you have write access to the directory

### Changes Not Reflecting in UI

**Issue**: File is saved but UI doesn't update

**Solution**: 
1. Check if Angular dev server is running
2. Manually refresh the browser (`Ctrl + R` or `Cmd + R`)
3. Clear browser cache if needed
4. Check if `ContentService` is reloading the data

## Production Deployment

⚠️ **Important**: The file server is for **development only**. 

For production:

1. **Option 1: Static Site**
   - Build the site: `npm run build`
   - Deploy to GitHub Pages, Netlify, Vercel, etc.
   - JSON files are bundled with the application
   - Editing requires rebuilding and redeploying

2. **Option 2: Backend API**
   - Create a backend service (Node.js, Python, etc.)
   - Implement authentication and authorization
   - Store data in a database or file system
   - Deploy backend and frontend separately

3. **Option 3: Headless CMS**
   - Use a service like Strapi, Contentful, or Sanity
   - Connect Angular app to CMS API
   - Edit content through CMS interface

## Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `npm start` | `ng serve` | Start Angular dev server only |
| `npm run file-server` | `node file-server.js` | Start file server only |
| `npm run dev` | `concurrently ...` | Start both Angular and file server |
| `npm run build` | `ng build` | Build for production |

## File Structure

```
deivamanikailasam/
├── file-server.js              # Express server for file writing
├── package.json                # Updated with file-server script
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── services/
│   │   │       └── skill-data.service.ts  # Calls file server API
│   │   └── features/
│   │       └── skills/
│   │           ├── skill-details-edit/     # Edit skills
│   │           └── experience-details-edit/ # Edit experiences
│   └── assets/
│       └── data/
│           ├── skill-details.json          # Skills data (auto-updated)
│           └── experience-details.json     # Experience data (auto-updated)
└── FILE_SERVER_README.md       # This file
```

## FAQ

**Q: Do I need to run the file server in production?**  
A: No, the file server is only for local development.

**Q: Can I edit the JSON files manually instead?**  
A: Yes, you can edit them directly in your code editor. The file server just makes it easier through the UI.

**Q: Will my changes be lost if I restart the server?**  
A: No, changes are written to the actual JSON files, so they persist.

**Q: Can I use this on a remote server?**  
A: Not recommended. This is designed for local development only. For remote editing, use a proper backend with authentication.

**Q: Does this work with hot reload?**  
A: The file is saved, but you may need to manually refresh the browser to see changes in the UI, depending on how the data is loaded.

## Support

If you encounter issues:

1. Check all processes are running (Angular + File Server)
2. Check browser console for errors
3. Check terminal/console where file-server is running for logs
4. Verify file permissions in `src/assets/data/`
5. Try restarting both servers

## License

Part of the Deivamanikailasam Portfolio Application

