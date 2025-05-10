<template>
    <SidebarProvider>
      <LayoutAppSidebar />
      <SidebarInset>
        <LayoutHeader />
        <div class="min-w-0 w-full flex-1 overflow-x-auto p-4 lg:p-6 pt-0 lg:pt-0">
          <slot />
        </div>
      </SidebarInset>
    </SidebarProvider>
  </template>


