<script setup lang="ts">
const title = ref('Config | Integration')

useHead({
  title
})

const project = ref('some-project-id')
const token = ref('some-token')

const snippet = ref(`<script defer src="https://cdn.monwaitlist.io/waitlist.js?project=${project.value}&token=${token.value}><\/script>`)

const code = ref(`<input data-waitly type='email' />`)

definePageMeta({
  middleware: ['project-id']
})
</script>

<template>
  <ConfigureLayout>
    <ul class="space-y-6">
      <li>
        <h3 class="text-lg font-semibold text-primary mb-2">
          1. Embed the script
        </h3>
        <p>
          Add this code snippet to your website's <code>&lt;head&gt;</code> section
        </p>

        <CodeDisplay :lineNumbers="true" language="html" class="mt-3">
          {{ snippet }}
        </CodeDisplay>
      </li>
      <li>
        <h3 class="text-lg font-semibold text-primary mb-2">
          2. Mark your email input
        </h3>
        <p>Add the data-waitly attribute to the input field where users enter their email:
          <CodeDisplay :lineNumbers="true" language="html" class="mt-3">
            {{ code }}
          </CodeDisplay>
        </p>
      </li>

      <li>
        <h3 class="text-lg font-semibold text-primary mb-2">
          3. Enjoy
        </h3>
        <p>
          <br>
          That's it.
          <br>
          <br>
          Test your form, your leads will start appearing automatically on your
          <NuxtLink :to="{ name: 'dashboard-projects-projectId' }" class="text-primary hover:underline font-semibold">
            dashboard
          </NuxtLink>.
        </p>
      </li>
    </ul>

  </ConfigureLayout>

</template>
