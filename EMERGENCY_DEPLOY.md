# EMERGENCY DEPLOYMENT - SCREENLOCAL

## OPTION 1: USE CURRENT WORKING URL (0 minutes)
✅ **IMMEDIATE SOLUTION FOR DEMO:**
`https://oak-film-connect-eileenalden.replit.app`

This URL has:
- Full ScreenLocal functionality  
- All demo data loaded
- Early user signup working
- exportEarlyUsers() console function
- Oakland branding

## OPTION 2: VERCEL DEPLOYMENT (10 minutes)
```bash
npm install -g vercel
npm run build
vercel --prod
```
Then in Vercel dashboard:
1. Add domain: screenlocal.app
2. Update DNS to Vercel's records

## OPTION 3: NETLIFY DEPLOYMENT (15 minutes)  
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## ENVIRONMENT VARIABLES FOR NEW DEPLOYMENT:
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
SESSION_SECRET=random-secret-key
NODE_ENV=production
```

## REPLIT DOMAIN FIX ATTEMPT:
Cancel current domain setup and retry with:
- `www.screenlocal.app` instead of `screenlocal.app`
- Or use subdomain: `demo.screenlocal.app`