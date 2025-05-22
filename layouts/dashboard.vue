<template>
  <SidebarProvider>
    <LayoutAppSidebar />
    <SidebarInset>
      <LayoutHeader />
      <div class="min-w-0 w-full flex-1 overflow-x-auto px-4 py-3 lg:px-6 lg:py-5">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
