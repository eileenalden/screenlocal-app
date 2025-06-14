# FilmMatch Oakland

## Overview

FilmMatch Oakland is a full-stack web application designed to connect filmmakers with local resources in Oakland, California. The platform serves as a marketplace where filmmakers can find locations, crew members, cast, and services for their productions, while providers can list their offerings. The application features AI-powered matching, production planning tools, and permit/tax incentive guidance.

## System Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript, Vite for build tooling
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Email Service**: SendGrid for notifications
- **Deployment**: Replit with autoscale deployment target

### Project Structure
The application follows a monorepo structure with clear separation of concerns:
- `/client` - React frontend application
- `/server` - Express.js backend API
- `/shared` - Shared TypeScript types and database schema
- `/components.json` - shadcn/ui configuration

## Key Components

### Frontend Architecture
- **Routing**: Wouter for client-side routing
- **Component Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Fetch API with custom wrapper for API requests

### Backend Architecture
- **API Design**: RESTful endpoints with Express.js
- **Database Layer**: Drizzle ORM with PostgreSQL
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error middleware
- **Development**: Hot reloading with Vite integration

### Database Schema
The application uses a PostgreSQL database with the following main entities:
- **Organizations**: Multi-tenant support for different cities/regions
- **Users**: Authentication and user management
- **Filmmakers**: Extended profile information for filmmakers
- **Resources**: Locations, crew, cast, services, and craft services
- **Projects**: Filmmaker project information
- **Matches**: AI-powered resource matching
- **Inquiries**: Communication between filmmakers and providers

## Data Flow

### Resource Discovery
1. Filmmakers browse or search for resources by category (locations, crew, cast, services)
2. AI-powered search translates natural language into specific resource queries
3. Smart filtering by budget, location, availability, and other criteria
4. Swipe interface allows quick review with favorites and skip tracking

### User Journey
1. Browse/swipe through resources manually OR use AI to narrow choices
2. Add resources to favorites with heart button, skip with X button
3. Access favorites across all categories from header counter
4. Message providers directly from favorites for contracting
5. Reset mechanism allows reviewing previously skipped resources

### Communication Process
1. Filmmakers initiate contact through in-app messaging
2. Providers receive notifications and can respond
3. Details are negotiated through the platform
4. No public project posting to avoid spam/overwhelm

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@sendgrid/mail**: Email service integration
- **@radix-ui/***: Headless UI components
- **zod**: Schema validation

### Development Tools
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for server
- **esbuild**: Production bundling for server
- **tailwindcss**: Utility-first CSS framework

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling

## Deployment Strategy

### Development Environment
- Runs on Replit with Node.js 20
- PostgreSQL 16 database module
- Hot reloading for both client and server
- Port 5000 mapped to external port 80

### Production Build
1. **Frontend**: Vite builds React app to `dist/public`
2. **Server**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `npm run db:push`

### Environment Configuration
- `NODE_ENV` determines development vs production behavior
- `DATABASE_URL` required for PostgreSQL connection
- Server serves static files in production mode

## Changelog

```
Changelog:
- June 14, 2025. Initial setup
- June 14, 2025. Implemented AI-powered natural language search with GPT-4o-mini
- June 14, 2025. Added comprehensive in-app messaging system with notifications
- June 14, 2025. Created service subcategory filtering (pre-production, equipment rental, craft services, post-production)
- June 14, 2025. Built favorites system with direct messaging from browse interface
- June 14, 2025. Restructured navigation to category-focused pages (locations, crew, cast, services)
- June 14, 2025. Added persistent favorites system with localStorage and reset functionality
- June 14, 2025. Removed "Post Project" feature - MVP focuses on filmmaker-initiated contact to avoid spam
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```