# ScreenLocal

## Overview

ScreenLocal is a full-stack web application designed to connect filmmakers with local resources in Oakland, California. The platform serves as a marketplace where filmmakers can find locations, crew members, cast, and services for their productions, while providers can list their offerings. The application features AI-powered matching, production planning tools, and permit/tax incentive guidance.

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
1. Filmmakers browse or search for resources by category (locations, crew, cast, services, permits, tax-rebates)
2. Location radius settings allow customization per resource type (locations: 10mi, crew/cast: 30mi, permits: 50mi, tax-rebates: 100mi)
3. AI-powered search translates natural language into specific resource queries
4. Smart filtering by budget, location, availability, and other criteria
5. Swipe interface allows quick review with favorites and skip tracking

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
- June 14, 2025. Added permit and tax rebate navigation tabs with dedicated categories
- June 14, 2025. Implemented location radius settings - different geographic ranges per resource type
- June 14, 2025. Removed "Oakland" branding for broader geographic flexibility
- June 14, 2025. Added direct messaging buttons to all resource cards for immediate contact
- June 14, 2025. Implemented multi-tenant branding support with customizable hero text per organization
- June 14, 2025. Updated footer copyright to "2025 ScreenLocal. All rights reserved."
- June 14, 2025. Removed MatchmakingInterface component and project filtering sections from home page
- June 14, 2025. Replaced cost estimator with SSO integration links to professional budgeting software (Saturation.io, Movie Magic Budgeting, Showbiz Budgeting, Hot Budget)
- June 14, 2025. Removed availability calendar - availability is resource-specific, not a broad utility
- June 14, 2025. Implemented carousel for category cards with all 6 resource types (locations, crew, cast, services, permits, tax rebates)
- June 14, 2025. Made category cards clickable to navigate directly to respective resource tabs
- June 14, 2025. Renamed Tax Rebates tab to Budget and consolidated tax rebates with SSO budgeting software integration
- June 14, 2025. Moved insurance resources from services to permits section (permits often require insurance liability coverage)
- June 14, 2025. Integrated production tools (SSO budgeting software) directly into Budget tab for seamless workflow
- June 14, 2025. Removed browse/search/favorites/radius controls from Budget tab - dedicated tax rebate and budgeting interface only
- June 14, 2025. Added East Bay city dropdown (Oakland, Berkeley, Richmond) with detailed tax rebate qualifications and application processes
- June 14, 2025. Implemented California state tax credit section with expandable details and direct application links
- June 14, 2025. Added disabled "Apply Online" placeholder button for Oakland tax rebate section
- June 14, 2025. Removed redundant "Discover Amazing Resources" carousel section from home page to eliminate duplication with category cards
- June 14, 2025. Removed SSO budget planning software section from home page since it's now properly integrated in the Budget tab
- June 14, 2025. Changed application name from FilmMatch to FilmMatcher to avoid confusion with another company
- June 14, 2025. Rebranded application from FilmMatcher to ScreenLocal with domain screenlocal.app
- June 14, 2025. Implemented filtered Browse system requiring subcategory selection before browsing resources
- June 14, 2025. Changed "Browse All" to "Browse" with mandatory filtering dialog for locations, crew, cast, services, and permits
- June 14, 2025. Added location type filters (Interior/Exterior - House/Apartment/Business) for location browsing
- June 14, 2025. Implemented crew department filters (Production, Camera, Grip & Electric, Art, Wardrobe, Hair & Makeup, Sound, Post-Production)
- June 14, 2025. Created comprehensive cast demographic filters with multi-select for gender and ethnicity categories
- June 14, 2025. Added age range filtering by decade (0-9 Children through 80+ Seniors) for cast demographics
- June 14, 2025. Added "Any" option for gender, ethnicity, and age range selections to allow broader cast searches
- June 14, 2025. Updated homepage hero text to "Your Oakland/East Bay Film Production Matchmaker"
- June 14, 2025. Reordered home page sections - moved permits & tax incentives above budgeting software tools
- June 14, 2025. Optimized buyer's psychological journey: moved "How It Works" section above category cards with "Get Started" CTA that leads to account creation
- June 14, 2025. Relocated AI search section from hero to after resource category carousel for better flow
- June 14, 2025. Added union/non-union filtering for cast and crew browsing - industry-standard distinction for rates and working conditions
- June 14, 2025. Implemented multi-select filtering for crew departments (Production, Camera, Grip & Electric, Art, Wardrobe, Hair & Makeup, Sound, Post-Production) and union status
- June 14, 2025. Integrated AI search directly with category carousel to create unified mental model - users can either browse cards or use AI search on the same content
- June 14, 2025. Added contextual messaging "Can't find what you need browsing? Let AI help you find the perfect match from these categories" to connect the two interaction modes
- June 14, 2025. Removed metrics row (0+ stats) from home page for cleaner user experience flow
- June 14, 2025. Integrated "Get Started" CTA and login link directly into hero banner below main descriptive text
- June 14, 2025. Replaced orange gradient hero with Oakland lakefront/downtown image background with dark overlay for text readability
- June 14, 2025. Removed "Free to browse. No credit card required." microcopy from hero section for cleaner appearance
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```