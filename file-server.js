const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

/**
 * API endpoint to save files to the file system
 */
app.post('/api/save-file', async (req, res) => {
  try {
    const { path: filePath, content } = req.body;

    if (!filePath || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields: path and content' 
      });
    }

    // Resolve the absolute path
    const absolutePath = path.resolve(__dirname, filePath);
    
    // Security check: ensure the path is within the project directory
    const projectRoot = path.resolve(__dirname);
    if (!absolutePath.startsWith(projectRoot)) {
      return res.status(403).json({ 
        error: 'Access denied: Cannot write outside project directory' 
      });
    }

    // Ensure the directory exists
    const directory = path.dirname(absolutePath);
    await fs.mkdir(directory, { recursive: true });

    // Write the file
    await fs.writeFile(absolutePath, content, 'utf8');

    console.log(`✅ File saved: ${filePath}`);
    res.json({ 
      success: true, 
      message: `File saved successfully: ${filePath}`,
      path: absolutePath 
    });

  } catch (error) {
    console.error('❌ Error saving file:', error);
    res.status(500).json({ 
      error: 'Failed to save file', 
      details: error.message 
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'File server is running',
    port: PORT 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 File server running on http://localhost:${PORT}`);
  console.log(`📝 Endpoint: POST http://localhost:${PORT}/api/save-file`);
  console.log(`💚 Health check: GET http://localhost:${PORT}/api/health`);
});

