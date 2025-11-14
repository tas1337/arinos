const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Steganography = require('./steganography');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize steganography class
const stego = new Steganography();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API Routes
app.post('/api/encode', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const message = req.body.message || stego.defaultMessage;
    const addPrompt = req.body.addPrompt === 'true' || req.body.addPrompt === true;

    // Read uploaded file
    const imageBuffer = await fs.readFile(req.file.path);

    // Encode message using steganography class
    const encodedImage = await stego.encode(imageBuffer, message, addPrompt);

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    // Send encoded image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="encoded.png"');
    res.send(encodedImage);
  } catch (error) {
    console.error('Encode error:', error);
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ error: error.message || 'Failed to encode image' });
  }
});

app.post('/api/decode', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Read uploaded file
    const imageBuffer = await fs.readFile(req.file.path);

    // Decode message using steganography class
    const message = await stego.decode(imageBuffer);

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    res.json({ message });
  } catch (error) {
    console.error('Decode error:', error);
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ error: error.message || 'Failed to decode image' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Steganography API running on port ${PORT}`);
});
