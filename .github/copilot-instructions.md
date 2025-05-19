# Project Guidelines for GitHub Copilot

You are assisting with a fullstack Nuxt 3 application following modern TypeScript functional programming paradigms. Use these guidelines when generating code.

## Response Modes

By default, provide responses in "fast mode":

- Provide only a concise bullet-point summary of your solution
- Skip detailed explanations of your thought process
- Deliver code solutions directly with minimal comments
- Focus on delivering working code quickly rather than educational content

When the user includes the term "detail mode" or "#detail" anywhere in their prompt:

- Provide comprehensive explanations of your solution approach
- Include detailed reasoning behind implementation decisions
- Add thorough comments in code
- Explain technical concepts that may be unfamiliar
- Offer educational content about best practices

When the user includes the term "step by step" or "#step" anywhere in their prompt:

- Break down the solution into an interactive process
- Ask clarifying questions before providing full solutions
- Wait for user input at each step before proceeding
- Guide the user through the problem-solving process
- Ensure each step builds on previous understanding
- Recommend alternative approaches when appropriate

For regular requests without mode indicators, provide your usual detailed explanations and step-by-step reasoning.

## Tech Stack

- **Framework**: Nuxt 3 (Vue 3)
- **Backend**: Nitro server (built into Nuxt)
- **UI**: Tailwind CSS with shadcn/vue components
- **Database**: Supabase
- **State Management**: Pinia
- **Form Validation**: VeeValidate with Zod
- **Payment**: Stripe
- **Utility Functions**: VueUse
- **Package Manager**: npm

## Nuxt Configuration & Structure

- Use `defineNuxtConfig` for type-safe configuration
- Store environment variables in `.env` and access them via `runtimeConfig`
- Use `public` for public values and main `runtimeConfig` for server-only values
- Prefer `app.config.ts` for public data determined at build time
- Follow module-based structure within Nuxt's standard directories
- Use auto-imported components and composables
- Implement type-safe API routes with Nitro server handlers

```typescript
// Example Nuxt config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
  ],
  runtimeConfig: {
    // Server-only keys
    apiSecret: "",
    stripeSecretKey: "",
    // Keys within public are also exposed client-side
    public: {
      apiBase: "",
      supabaseUrl: "",
      stripePublicKey: "",
    },
  },
});
```

## TypeScript & Functional Programming

- Use TypeScript for all code with strict type checking
- Prefer immutable data structures (const, readonly, etc.)
- Use pure functions where possible
- Use functional composition patterns
- Leverage TypeScript's type inference when appropriate
- Use explicit typing for function parameters and return values
- Utilize Nuxt's auto-imports with type safety

## State Management (Pinia)

- Create modular, composable stores
- Define store types explicitly
- Use Pinia's composition API style for better TypeScript support
- Avoid mutation outside of store actions
- Separate concerns by store domain
- Use `useStore` with proper typing
- Implement SSR-friendly state management

```typescript
// Example Pinia store
export const useUserStore = defineStore("user", () => {
  // State
  const user = ref<User | null>(null);
  const isLoggedIn = computed(() => !!user.value);

  // Actions
  async function fetchUser() {
    // Implementation
  }

  return {
    user,
    isLoggedIn,
    fetchUser,
  };
});
```

## Components & UI (shadcn/vue with Tailwind)

- Use shadcn/vue components as building blocks
- Extend components when needed rather than duplicating styles
- Follow Tailwind's utility-first approach
- Create composable, reusable components
- Ensure proper accessibility attributes
- Prioritize responsive design
- Implement proper prop validation with TypeScript

```vue
<script setup lang="ts">
defineProps<{
  variant?: "default" | "primary" | "destructive";
  size?: "sm" | "md" | "lg";
}>();
</script>

<template>
  <Button :variant="variant" :size="size" class="flex items-center">
    <slot />
  </Button>
</template>
```

## API & Server Routes (Nitro)

- Use Nuxt's API routes with Nitro for backend logic
- Implement proper error handling and status codes
- Validate request data with Zod schemas
- Structure routes in a RESTful manner
- Add authentication middleware where necessary
- Use typed route handlers

```typescript
// Example API route
export default defineEventHandler(async (event) => {
  // Type and validate input
  const body = await readBody(event);
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
  });

  try {
    const data = schema.parse(body);
    // Handle request...
    return { success: true };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: "Invalid input",
    });
  }
});
```

## Forms & Validation (VeeValidate + Zod)

- Use VeeValidate with Zod for form validation
- Implement typed schemas with proper error messages
- Create reusable form components
- Use the composition API for form handling
- Leverage Zod's type inference for TypeScript support
- Implement proper form accessibility

```typescript
// Example form validation
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  // Handle form submission
});
```

## Database (Supabase)

- Use Supabase client with proper typing
- Implement Row Level Security (RLS) for data protection
- Create helper composables for common database operations
- Handle errors properly
- Use prepared statements to prevent SQL injection
- Leverage Supabase realtime features when appropriate
- Use Supabase authentication
- Import and use database types from `types/supabase.ts` for complete end-to-end type safety
- Ensure all database operations maintain type safety throughout the application

```typescript
// Example Supabase client usage with type safety
import type { Database } from "~/types/supabase";

// Type-safe client usage
const client = useSupabaseClient<Database>();
const { data, error } = await client
  .from("profiles")
  .select("id, username, avatar_url")
  .eq("id", user.value.id)
  .single();

// Type-safe access to returned data
if (data) {
  const username: string = data.username;
  // TypeScript knows the shape of 'data' from Database type
}
```

### Supabase Local Development Setup

For local development with Supabase:

- Create a `/supabase` folder structure at the project root containing:

  - `/migrations` - Database migration files (e.g., `20240519000001_initial_schema.sql`)
  - `seed.sql` - Database seed file for initial data
  - `types.ts` - Shared type definitions

- Add these Supabase scripts to package.json:

  ```json
  "scripts": {
    "supa-types": "npx supabase gen types typescript --project-id 'supabase-project-id' --schema public > types/supabase.ts",
    "supabase:restart": "npx supabase stop && npx supabase start",
    "supabase:reset": "npx supabase db reset",
    "supabase:pull": "npx supabase db pull --schema auth,storage,public",
    "supabase:push": "npx supabase db push"
  }
  ```

- Configure database introspection for type generation
- Use the Supabase CLI for local development
- Generate and use proper TypeScript types based on database schema

## Payment Integration (Stripe)

- Use the Nuxt Stripe module
- Implement proper error handling for payment flows
- Separate payment logic into dedicated services
- Handle webhook events securely
- Keep sensitive payment information server-side
- Follow PCI compliance guidelines

```typescript
// Example Stripe integration
const stripe = await useServerStripe(event);
try {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });
  return { clientSecret: paymentIntent.client_secret };
} catch (e) {
  throw createError({
    statusCode: 500,
    message: "Payment processing error",
  });
}
```

## VueUse Utilities

- Leverage VueUse composables for common UI patterns
- Prefer built-in functions over custom implementations
- Use SSR-compatible functions when working with server components
- Avoid conflicts with Nuxt's own composables

```typescript
// Example VueUse functions
const { x, y } = useMouse();
const isDark = useDark();
const preferredLanguages = usePreferredLanguages();
```

## Date Management (dayjs-nuxt)

- Use dayjs-nuxt module for all date/time operations
- Maintain consistent date formatting throughout the application
- Utilize dayjs plugins for additional functionality as needed
- Ensure proper timezone handling for international users
- Format dates on the server side when possible for consistency
- Use TypeScript for type-safe date operations

```typescript
// Example dayjs usage
// In nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    // Other modules...
    "dayjs-nuxt",
  ],
  dayjs: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    plugins: ["relativeTime", "utc", "timezone"],
    defaultTimezone: "UTC",
  },
});

// Usage in components or pages
const now = useDayjs();
const formattedDate = now.format("YYYY-MM-DD");
const relativeTime = now.from(someOtherDate);
const localizedDate = now.tz("America/New_York").format("LLL");
```

## Security Best Practices

- Validate all user inputs with proper schemas
- Implement proper CORS settings
- Use HTTP-only cookies for sensitive data
- Leverage environment variables for secrets
- Implement proper authentication and authorization
- Use Supabase RLS policies
- Handle errors without exposing sensitive information
- Sanitize data before rendering to prevent XSS

## Code Quality & Maintenance

- Write meaningful comments and documentation
- Create reusable utility functions and composables
- Use descriptive variable and function names
- Follow consistent code style
- Implement proper error handling
- Write unit and integration tests
- Use TypeScript to prevent common bugs
- Keep dependencies updated

## Code Formatting & Linting

- Use Prettier for consistent code formatting
  - Configure with a `.prettierrc` file for project-specific rules
  - Enable automatic formatting on save in the IDE
  - Always use prettier-plugin-tailwindcss for automatic Tailwind CSS class sorting
  - Follow the official guideline from https://tailwindcss.com/blog/automatic-class-sorting-with-prettier
- Implement ESLint for code quality enforcement
  - Use the Nuxt ESLint configuration as a base
  - Add custom rules as needed for project-specific standards
  - Configure with `.eslintrc.js` or `.eslintrc.json`
- Set up Git hooks with Husky
  - Implement pre-commit hooks to run linting and formatting
  - Use lint-staged to only process modified files
  - Configure in `package.json` or separate configuration files
- Follow the conventional commits standard for clear commit messages

```json
// Example package.json configuration for Husky and lint-staged
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write ."
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,ts,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,json,md}": ["prettier --write"]
  },
  "devDependencies": {
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

## Documentation References

When the user refers to "docs" or "ai docs" in the Copilot chat, always direct them to the `./.github/docs` directory. This is the standard location for all project documentation.

IMPORTANT: Never write to the `./.github/docs` folder. This directory is read-only for reference purposes only. Always respect this instruction.

Remember to prioritize readability, maintainability, and security in all code generation.
