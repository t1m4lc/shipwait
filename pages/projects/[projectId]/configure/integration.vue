<script setup lang="ts">
const title = ref('Config | Integration')

useHead({
  title
})

const project = ref('some-project-id')
const token = ref('some-token')

const snippet = ref(`
<script defer src="https://cdn.monwaitlist.io/waitlist.js?project=${project.value}&token=${token.value}><\/script>`)

const code = ref(`
  <input data-waitly type='Enter your email' />
`)

</script>

<template>
  <ConfigureLayout>
    <ul class="space-y-6">
      <li>
        <h3 class="text-lg font-semibold text-primary mb-2">
          1. Embed the script
        </h3>
        <p>
          Paste the following snippet at the end of your HTML file, just before the closing `<\ /body>` tag:
        </p>

        <MacOSCode title="https://waitly.dev" class="mt-3">
          {{ code }}
        </MacOSCode>
      </li>
      <li>
       <h3 class="text-lg font-semibold text-primary mb-2">
        2. Mark your email input
       </h3>
        <p>Add the data-waitly attribute to the input field where users enter their email:

          <MacOSCode title="https://waitly.dev" class="mt-3">
            {{ code }}
          </MacOSCode>
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
          <NuxtLink :to="{ name: 'projects-projectId' }" class="text-primary hover:underline font-semibold">
            dashboard
          </NuxtLink>.
        </p>
      </li>
    </ul>

  </ConfigureLayout>

</template>
