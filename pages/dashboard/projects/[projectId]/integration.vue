<script setup lang="ts">
import generateSnippet from '~/utils/snippet'

const title = ref('Integration')
useHead({
  title
})

definePageMeta({
  middleware: ['project-id']
})

const code1 = ref(
  `<form>
    <input data-shipwait type="email" placeholder="Enter your email" required />
    <button type="submit">Join the waitlist</button>
</form>`)

const code2 = ref(
  `<form>
  <input data-shipwait type="email" placeholder="Enter your email" required />
  <p data-shipwait-message></p> 
  <button type="submit">Join the waitlist</button>
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
  <div class="space-y-6">
    <div class="space-y-0.5">
      <h2 class="text-2xl font-bold tracking-tight">
        {{ title }}
      </h2>
      <p class="text-muted-foreground">
        Connect Shipwait to your website and collect leads
      </p>
    </div>

    <div class="pt-4">
      <h2 class="text-xl font-bold">Connect Shipwait to your form and capture leads</h2>
      <ul class="space-y-6 mt-6">
        <li>
          <h3 class="text-md font-semibold text-primary mb-2">
            1. Embed the script
          </h3>
          <p class="text-foreground">
            Add this code snippet to your website's <code>&lt;head&gt;</code> section
          </p>

          <CodeDisplay language="html" class="mt-3">
            {{ snippet }}
          </CodeDisplay>
        </li>
        <li>
          <h3 class="text-md font-semibold text-primary mb-2">
            2. Mark your email input
          </h3>
          <p class="text-foreground">Add the <code>data-shipwait</code> attribute to the form input field where users
            enter
            their email:</p>
          <CodeDisplay language="html" class="mt-3">
            {{ code1 }}
          </CodeDisplay>
        </li>

        <li>
          <h3 class="text-md font-semibold text-primary mb-2">
            3. Add message container (optional)
          </h3>
          <p class="text-foreground">Add the <code>data-shipwait-message</code> attribute to a paragraph or div element
            where success and error
            messages will be
            displayed:</p>
          <CodeDisplay language="html" class="mt-3">
            {{ code2 }}
          </CodeDisplay>
        </li>

        <li>
          <h3 class="text-md font-semibold text-primary mb-2">
            4. You're all set!
          </h3>
          <p class="text-foreground">
            That's it! Your waitlist form is now fully configured.
            <br><br>
            Test your form and your leads will automatically appear on your
            <NuxtLink :to="{ name: 'dashboard-projects-projectId-leads' }" class="text-primary hover:underline font-semibold">
              dashboard
            </NuxtLink>.
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>