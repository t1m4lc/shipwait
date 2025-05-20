<script setup lang="ts">
import generateSnippet from '~/utils/snippet';

const title = ref('Connect')
useHead({
  title
})

definePageMeta({
  middleware: ['project-handler']
})

// Simple form example
const simpleFormExample = ref(
  `<form>
  <input data-shipwait type="email" placeholder="Enter your email" required />
  <button type="submit">Join the waitlist</button>
</form>`)

// Complete form example with additional fields
const completeFormExample = ref(
  `<form>
  <div class="form-group">
    <label for="email">Email address</label>
    <input 
      data-shipwait 
      type="email" 
      id="email" 
      placeholder="your@email.com" 
      required 
    />
  </div>
  
  <div class="form-group">
    <p data-shipwait-message class="message"></p>
  </div>
  
  <button type="submit" class="submit-button">
    Join the waitlist
  </button>
</form>`)

const store = useProjectsStore()

const snippet = computed(() => {
  const id = store.selectedProjectId
  if (!id) {
    return 'ERROR IN SNIPPET GENERATION'
  }

  return generateSnippet(id);
});
</script>

<template>
  <div class="space-y-8 max-w-4xl">
    <!-- Header section -->
    <div class="space-y-1">
      <h1 class="text-3xl font-bold tracking-tight">
        {{ title }}
      </h1>
      <p class="text-lg text-muted-foreground">
        How to start collecting leads with Shipwait
      </p>
    </div>

    <!-- Integration options explanation -->
    <div class="bg-muted/50 p-6 rounded-lg border border-border">
      <h2 class="text-xl font-semibold mb-3">Two ways to collect leads with Shipwait</h2>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Option 1: Website integration -->
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-primary">
            <div class="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              1
            </div>
            <h3 class="font-medium">Website Integration</h3>
          </div>
          <p class="text-muted-foreground">
            Add Shipwait to your existing website forms by following the steps below.
          </p>
        </div>

        <!-- Option 2: Dedicated landing page -->
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-primary">
            <div class="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              2
            </div>
            <h3 class="font-medium">Shipwait Landing Page</h3>
          </div>
          <p class="text-muted-foreground">
            Use a dedicated Shipwait landing page that we host for you.
            <!-- <strong class="text-foreground">No code required.</strong> -->
          </p>
          <NuxtLink :to="{ name: 'dashboard-projects-projectSlug-page' }" class="inline-flex items-center text-sm font-medium text-primary hover:underline">
            Create landing pages →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Step-by-step integration guide -->
    <div class="border rounded-lg overflow-hidden">
      <div class="bg-muted/50 px-6 py-4 border-b">
        <h2 class="text-xl font-semibold">Website Integration Guide</h2>
      </div>

      <div class="p-6 space-y-8">
        <!-- Step 1 -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              1
            </div>
            <h3 class="text-lg font-semibold">Add the Shipwait script to your website</h3>
          </div>

          <div class="pl-11">
            <p class="text-muted-foreground mb-3">
              Copy and paste this code snippet into your website's <code class="px-1 py-0.5 bg-muted rounded">&lt;head&gt;</code> section:
            </p>
            <CodeDisplay language="html" class="mt-3">
              {{ snippet }}
            </CodeDisplay>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              2
            </div>
            <h3 class="text-lg font-semibold">Mark your email input field</h3>
          </div>

          <div class="pl-11">
            <p class="text-muted-foreground mb-3">
              Add the <code class="px-1 py-0.5 bg-muted rounded">data-shipwait</code> attribute to your email input:
            </p>
            <CodeDisplay language="html" class="mt-3">
              {{ simpleFormExample }}
            </CodeDisplay>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              3
            </div>
            <h3 class="text-lg font-semibold">Add a message container (optional but recommended)</h3>
          </div>

          <div class="pl-11">
            <p class="text-muted-foreground mb-3">
              Add a <code class="px-1 py-0.5 bg-muted rounded">data-shipwait-message</code> attribute to an element where
              success/error messages will appear:
            </p>
            <CodeDisplay language="html" class="mt-3">
              {{ completeFormExample }}
            </CodeDisplay>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              4
            </div>
            <h3 class="text-lg font-semibold">You're all set!</h3>
          </div>

          <div class="pl-11">
            <p class="text-muted-foreground">
              That's it! Your form is now connected to Shipwait. Test it out by submitting a lead.
            </p>
            <div class="mt-4 flex items-center gap-2">
              <NuxtLink :to="{ name: 'dashboard-projects-projectSlug-leads' }" class="inline-flex items-center text-sm font-medium text-primary hover:underline">
                View your leads →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>