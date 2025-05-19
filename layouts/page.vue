<template>
    <SidebarProvider>
        <LayoutAppSidebar />
        <SidebarInset>
            <div class="size-full">
                <slot />
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>
