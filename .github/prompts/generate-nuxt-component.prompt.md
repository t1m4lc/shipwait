---
mode: 'agent'
tools: ['codebase', 'createFile']
description: 'Generate a new Nuxt component following project patterns'
---
# Nuxt Component Generator

I need help creating a new Nuxt component for my project. Before proceeding, I'll ask for information about the type of component you want to create:

## Component Type Selection

Please select the type of component you need:

1. **UI Component**: A reusable presentation-only component with props and emits (e.g., buttons, cards, form elements)
2. **Smart Component**: A component with data fetching, state management, and business logic
3. **Page Component**: A full page component to be placed in the pages directory
4. **Layout Component**: A layout wrapper for pages

## Process

Once you select a component type, I'll:

1. Analyze existing components to understand the project's component patterns
2. Generate a new component following those patterns and best practices for the selected type
3. Include appropriate props, emits, composables, and documentation based on the type
4. Add any necessary tests if requested

## Component Details

For each component type, I'll ask for specific information:

### UI Component
- Component name and purpose
- Required props and their types
- Events to emit
- Styling approach (CSS, Tailwind, etc.)
- If it's a form component:
  - Form validation requirements (with Zod or Vee-Validate)
  - Form submission handling
  - Field types and validation rules

### Smart Component
- Component name and purpose
- External APIs or data sources to use (like Supabase)
- State management approach
- Loading and error states handling
- Any VueUse functions needed for enhanced functionality

### Page Component
- Page name and route
- Layout to use
- Required meta information
- Nested components to include
- Form handling needs (Zod schemas, Vee-Validate)
- VueUse composables needed (e.g., useLocalStorage, useFetch)

### Layout Component
- Layout name
- Structure and sections
- Global elements to include
- Responsive behavior

## Project-Specific Features

I'll incorporate best practices from Nuxt 3, including:
- Auto-imports for components and composables
- TypeScript support
- Composition API with `<script setup>`
- SEO metadata if applicable
- Proper routing for pages
- Form validation using:
  - Zod for schema validation (type-safe validation)
  - Vee-Validate for form handling when appropriate
- VueUse functions for common UI patterns and utilities
- Supabase integration for data management in smart components

For forms, I'll ask if you prefer:
- Zod for schema definition and validation
- Vee-Validate for form handling
- A combination of both approaches

I'll also suggest useful VueUse functions that could enhance your component functionality.

Reference documentation in the brain/docs/nuxt directory will be used to ensure the component follows framework-specific best practices.
