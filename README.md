# 🔐 Steganography App

A modern web application for embedding secret messages into images using LSB (Least Significant Bit) steganography. Built with Node.js backend and Angular frontend, fully Dockerized and ready for Fly.io deployment.

## 🚀 Quick Start

### Development
```bash
npm run dev
```
- Backend: http://localhost:3000
- Frontend: http://localhost:4202 (or check the terminal output)

**Note:** If port 4202 is in use, you can change it by setting `FRONTEND_PORT` environment variable:
```bash
FRONTEND_PORT=4203 npm run dev
```

### Deploy to Fly.io
```bash
# 1. Add FLY_API_TOKEN to .env file
# 2. Run:
npm run deploy
```

## 📁 Project Structure

```
fixphoto/
├── backend/              # Node.js/Express API
│   ├── server.js         # Main server with steganography logic
│   └── package.json
├── frontend/             # Angular application
│   ├── src/
│   └── package.json
├── deployment/           # Deployment configuration
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── Dockerfile
│   ├── fly.toml
│   └── deploy.js
├── Dev/                  # Documentation and examples
│   ├── README.md
│   ├── QUICKSTART.md
│   └── ... (other docs and sample images)
├── python/               # Original Python implementation
│   └── stego_app.py      # Standalone Python tool (legacy)
└── package.json          # Root package.json with scripts
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Fly.io CLI (for deployment)

### Installation

1. **Install dependencies:**
```bash
cd backend && npm install
cd ../frontend && npm install
cd .. && npm install
```

2. **Create `.env` file:**
```bash
cp deployment/.env.example .env
# Edit .env and add your FLY_API_TOKEN
```

## 📖 Documentation

All documentation, examples, and sample images are in the `Dev/` folder:
- `Dev/README.md` - Full documentation
- `Dev/QUICKSTART.md` - Quick start guide
- `Dev/PROJECT_SUMMARY.md` - Project overview
- `Dev/AI_DECODER_GUIDE.md` - Guide for AI/recruiters

## 🐍 Python Version

The original Python implementation is in `python/stego_app.py`. It's a standalone CLI tool that doesn't require the web app. Useful for:
- Quick command-line encoding/decoding
- Batch processing
- Integration into other Python projects

## 🚀 Deployment

See `deployment/` folder for all deployment-related files:
- Docker configurations
- Fly.io setup
- Deployment scripts

Run `npm run deploy` to deploy to Fly.io (requires FLY_API_TOKEN in `.env`).

## 📝 License

MIT
