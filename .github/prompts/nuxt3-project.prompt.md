---
mode: 'agent'
tools: ['codebase', 'terminal', 'githubRepo']
description: 'Create a new Nuxt 3 project with best practices including Tailwind CSS and shadcn/ui'
---

# Create a New Nuxt 3 Project with Best Practices

Please help me create a new Nuxt 3 project following best practices and the official Nuxt documentation. I'd like you to guide me through setting up a modern Nuxt 3 application with the following features:

## Required Features
- A complete Nuxt 3 application with TypeScript support
- Tailwind CSS for styling with proper configuration
- shadcn/ui components integration for a beautiful UI
- A well-structured layout ready for development
- Proper TypeScript configuration with strict type checking
- Folder structure following Nuxt 3 official conventions

## Project Structure
Please set up the project with the following directory structure based on Nuxt 3 conventions:
- `/app` - App-specific configuration
- `/assets` - Static assets like images, fonts, etc.
- `/components` - Vue components, including shadcn components
- `/composables` - Reusable Vue composables following the Nuxt auto-import pattern
- `/content` - Content files if needed
- `/layouts` - Layout components including default and custom layouts
- `/middleware` - Route middleware
- `/pages` - Application pages and routing
- `/plugins` - Nuxt plugins
- `/public` - Public static assets
- `/server` - Server routes and middleware
- `/supabase` - Supabase related files
  - `/migrations` - Database migration files
  - `seed.sql` - Database seed file
  - `types.ts` - Supabase type definitions
- `/types` - TypeScript type definitions, including Supabase generated types
- `/utils` - Utility functions

## UI Implementation
- A responsive layout with header, footer, and main content area with nuxt shadcn module
- Dark/light mode toggle using Tailwind and nuxt shadcn module
- Basic navigation components
- Several shadcn/ui components as examples (button, card, dialog, etc.)
- Proper CSS organization with Tailwind

## Development Setup
- ESLint and Prettier configuration for code quality
  - ESLint for enforcing code standards and catching bugs
  - Prettier for consistent code formatting
  - Integration between ESLint and Prettier to avoid conflicts
- Husky for Git hooks
  - Pre-commit hooks to enforce code quality
  - Lint-staged to only check modified files
- TypeScript setup with proper types
- Development scripts in package.json
- README with instructions for development and deployment

## Optional Modules
Before implementation, please ask if I'd like to include any of these optional modules:
- Pinia for state management
- VeeValidate with Zod for form validation
- Nuxt Content for documentation
- Nuxt Image for optimized image handling
- Nuxt i18n for internationalization
- dayjs-nuxt for date handling
- Nuxt Test Utils for testing

## Supabase Integration (Required)
The project must include Supabase integration with:
- Nuxt Supabase module properly configured
- Local development setup with Supabase CLI
- A `/supabase` folder structure containing:
  - `/migrations` folder for database migrations
  - `seed.sql` for database seeding
  - `types.ts` for shared type definitions
- Database introspection for type generation
- Scripts in package.json for Supabase operations

## Installation Instructions
Please provide clear step-by-step instructions for:
1. Creating the project with the correct Nuxt command
2. Installing all necessary dependencies
3. Configuring Tailwind CSS and shadcn
4. Setting up TypeScript properly
5. Setting up Supabase integration:
   - Installing and configuring the Nuxt Supabase module
   - Setting up Supabase CLI for local development
   - Creating the necessary Supabase folder structure
   - Configuring database introspection for type generation
   - Adding Supabase scripts to package.json:
     ```json
     "supa-types": "npx supabase gen types typescript --project-id 'supabase-project-id' --schema public > types/supabase.ts",
     "supabase:restart": "npx supabase stop && npx supabase start",
     "supabase:reset": "npx supabase db reset",
     "supabase:pull": "npx supabase db pull --schema auth,storage,public",
     "supabase:push": "npx supabase db push"
     ```
6. Adding any additional modules I choose to include
7. Setting up ESLint, Prettier and Husky:
   - Installing and configuring ESLint with Nuxt best practices
   - Installing and configuring Prettier with appropriate rules
   - Setting up Husky with pre-commit hooks for linting and formatting
   - Configuring lint-staged to optimize performance
   - Creating npm scripts for manual linting and formatting
8. Running the development server
9. Building for production

Your detailed guidance will help me get started with a robust, well-structured Nuxt 3 application following all current best practices.