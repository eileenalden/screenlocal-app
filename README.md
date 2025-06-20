# ScreenLocal

A full-stack web application connecting filmmakers with local resources in Oakland/East Bay area.

## Features

- **Resource Discovery**: Browse locations, crew, talent, services, permits, and budget tools
- **AI-Powered Search**: Natural language search using GPT-4o-mini
- **Smart Filtering**: Category-specific filters for demographics, departments, property types
- **Early User Collection**: Pre-launch signup with feature requests
- **Multi-tenant Support**: Customizable branding per organization

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, Drizzle ORM
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4o-mini for search processing

## Environment Variables

Required environment variables (set in deployment platform):

```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
SESSION_SECRET=random-secret-key
NODE_ENV=production
```

## Development

```bash
npm install
npm run dev
```

## Production Deployment

```bash
npm run build
npm start
```

## License

© Eileen Alden, 2025. All rights reserved.