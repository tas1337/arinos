# 🚀 Fly.io Deployment Guide

## Setup

1. **Install Fly.io CLI:**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   
   # Mac/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign up / Login:**
   ```bash
   flyctl auth signup
   # OR if you already have an account:
   flyctl auth login
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

   Or manually:
   ```bash
   cd deployment
   flyctl deploy --config fly.toml
   ```

## Notes

- **No API key needed!** Fly.io uses `flyctl auth login` for authentication
- The deployment script will:
  - Check if you're logged in
  - Create the app if it doesn't exist
  - Build and deploy your app
- Your app will be available at: `https://stego-app.fly.dev`

## Troubleshooting

- If you get "not logged in" error: Run `flyctl auth login`
- If you get "app not found": The script will create it automatically
- If build fails: Check that `backend/` and `frontend/` folders exist in the project root

