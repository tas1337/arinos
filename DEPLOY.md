# 🚀 Fly.io Deployment Guide - CHEAPEST CONFIGURATION

## Cost Optimization Features

✅ **Configured for minimum cost:**
- **Shared CPU** (cheapest option)
- **256MB RAM** (minimum allowed)
- **1 CPU core** (minimum)
- **Auto-scales to zero** when idle (no cost when not in use)
- **Auto-stops machines** after inactivity
- **Cheapest region** (iad)

**Actual Pricing:**
- **FREE TIER INCLUDES:**
  - 3 shared-CPU-1x 256MB VMs (FREE)
  - 3GB persistent storage (FREE)
  - 160GB outbound bandwidth/month (FREE)
  
- **If you stay within free tier:** **$0/month** ✅
- **If running 24/7 (exceeds free tier):** ~$1.80/month per VM
- **With auto-stop (current config):** Only pay for hours when machines are running
- **Startup time:** ~5-10 seconds (cold start when scaled to zero)

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
- **Cost-saving:** App scales to zero when not in use, so you only pay for active usage

## Troubleshooting

- If you get "not logged in" error: Run `flyctl auth login`
- If you get "app not found": The script will create it automatically
- If build fails: Check that `backend/` and `frontend/` folders exist in the project root

## Cost Management

**Current Configuration (min_machines_running = 0):**
- ✅ **FREE** - Stays within free tier (3 VMs free)
- ✅ App automatically stops when idle (saves money)
- ✅ Only runs when receiving traffic
- ⚠️ **Startup time:** ~5-10 seconds (cold start)

**If you want faster startup (always running):**
- Change `min_machines_running = 1` in `fly.toml`
- **Cost:** ~$1.80/month (if exceeds free tier)
- **Startup time:** Instant (always running)

**Free Tier Limits:**
- 3 shared-cpu-1x 256MB VMs
- 3GB persistent storage
- 160GB outbound bandwidth/month

**If you exceed free tier:**
- Compute: $0.0000025/second (~$1.80/month per VM if 24/7)
- Storage: $0.15/GB/month (after 3GB free)
- Bandwidth: $0.02/GB (after 160GB free)

