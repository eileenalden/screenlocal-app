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
1. Filmmakers browse or search for resources by type and filters
2. AI-powered matching suggests relevant resources based on project requirements
3. Smart filtering by budget, location, availability, and other criteria
4. Resource cards display pricing, ratings, and key information

### Matching Algorithm
1. Project requirements are analyzed using AI
2. Resources are scored based on compatibility factors:
   - Budget alignment (30% weight)
   - Location proximity (20% weight)
   - Genre/type matching (25% weight)
   - Availability overlap (25% weight)
3. Top matches are presented with explanations

### Booking Process
1. Filmmakers express interest through inquiries
2. Providers receive notifications and can respond
3. Details are negotiated through the platform
4. Bookings are confirmed and managed

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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```