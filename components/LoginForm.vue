<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl">
          Welcome back
        </CardTitle>
        <CardDescription>
          Login with your email and password to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid gap-6">
            <div class="grid gap-6">
              <div class="grid gap-2">
                <Label html-for="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div class="grid gap-2">
                <div class="flex items-center">
                  <Label html-for="password">Password</Label>
                  <a href="#" class="ml-auto text-xs underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" class="w-full">
                Login
              </Button>
            </div>
            <div class="text-center text-sm">
              Don't have an account yet?

              <NuxtLink to="register" class="underline underline-offset-4 hover:text-primary">
                Sign up
              </NuxtLink>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
    <div
      class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
      By clicking and continue, you agree to our
      <NuxtLink to="terms">
        Terms of Service
      </NuxtLink>
      and
      <NuxtLink to="privacy">
        Privacy Policy
      </NuxtLink>
      .
    </div>
  </div>
</template>