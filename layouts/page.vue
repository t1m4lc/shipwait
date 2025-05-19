<template>
    <SidebarProvider>
        <LayoutAppSidebar />
        <SidebarInset>
            <LayoutHeader />
            <div class="size-full">
                <slot />
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>
