<script setup lang="ts">

</script>

<template>
  <header
    class="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
    <div class="flex items-center gap-2 px-4 lg:px-6">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
    </div>
  </header>
</template>