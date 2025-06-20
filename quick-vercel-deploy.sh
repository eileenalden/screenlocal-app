#!/bin/bash
# Quick Vercel deployment for emergency
echo "Building for production..."
npm run build

echo "Deploying to Vercel..."
npx vercel --prod --yes

echo "After deployment:"
echo "1. Go to Vercel dashboard"
echo "2. Add custom domain: screenlocal.app"
echo "3. Point DNS to Vercel (they'll show you the records)"