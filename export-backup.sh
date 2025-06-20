#!/bin/bash
# Emergency backup script for ScreenLocal
echo "Creating emergency backup of ScreenLocal project..."

# Create backup directory
mkdir -p /tmp/screenlocal-backup

# Copy all source files
cp -r client /tmp/screenlocal-backup/
cp -r server /tmp/screenlocal-backup/
cp -r shared /tmp/screenlocal-backup/
cp -r scripts /tmp/screenlocal-backup/

# Copy config files
cp package.json /tmp/screenlocal-backup/
cp package-lock.json /tmp/screenlocal-backup/
cp tsconfig.json /tmp/screenlocal-backup/
cp vite.config.ts /tmp/screenlocal-backup/
cp tailwind.config.ts /tmp/screenlocal-backup/
cp drizzle.config.ts /tmp/screenlocal-backup/
cp components.json /tmp/screenlocal-backup/
cp postcss.config.js /tmp/screenlocal-backup/
cp replit.md /tmp/screenlocal-backup/

# Create deployment instructions
cat > /tmp/screenlocal-backup/DEPLOYMENT.md << 'EOF'
# ScreenLocal Emergency Deployment

## Quick Deploy Options:

### Option 1: Vercel (Fastest)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Set environment variables in Vercel dashboard
4. Domain will be available immediately

### Option 2: Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod`
3. Configure domain in Netlify dashboard

### Option 3: Railway
1. Connect GitHub repo to Railway
2. Deploy automatically with domain support

## Environment Variables Needed:
- DATABASE_URL
- OPENAI_API_KEY
- SESSION_SECRET

## Build Commands:
- Build: `npm run build`
- Start: `npm start`
EOF

echo "Backup created at /tmp/screenlocal-backup"
echo "Run 'tar -czf screenlocal-backup.tar.gz -C /tmp screenlocal-backup' to create archive"