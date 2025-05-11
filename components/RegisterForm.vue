<template>
  <form class="flex flex-col gap-10">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-xl lg:text-3xl font-bold">
        Create your account
      </h1>
      <p class="text-balance text-sm text-muted-foreground">
        And start getting leads with Waitly</p>
    </div>
   <div class="flex flex-col gap-6">
       <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </div>
      <div class="grid gap-2">
          <Label for="password">Password</Label>

        <Input id="password" type="password" required />
      </div>
      <Button type="submit" class="w-full">
        Let's go
      </Button>
    
    <div class="text-center text-sm">
      Already have an account?
      <NuxtLink
        to="login"
        class="underline underline-offset-4 hover:text-primary">
        Login
      </NuxtLink>
    
    </div>
   </div>
  </form>
</template>
