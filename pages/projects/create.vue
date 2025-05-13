<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
    <div class="w-full max-w-sm md:max-w-3xl">

      <div class="flex flex-col gap-6">
        <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-xl">
            Create a new project
          </CardTitle>
          <CardDescription>
            Enter your project details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProjectForm />
        </CardContent>
      </Card>
        <div
          class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          A new project is the first step towards making your ideas a reality.
        </div>
      </div>
    </div>
  </div>
</template>
