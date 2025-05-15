<script setup lang="ts">
import { ChevronsUpDown, CreditCard, CircleUser, LogOut } from 'lucide-vue-next';
import { useSidebar } from '../ui/sidebar';

defineProps<{
  user: {
    name: string
    email: string
    avatar: string | null
  }
}>()

const { isMobile } = useSidebar()

const emit = defineEmits(['logout'])
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage v-if="user?.avatar" :src="user?.avatar" :alt="user.name" />
              <AvatarFallback class="rounded-lg uppercase text-xs">
                {{ user.name.slice(0, 2) }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium first-letter:uppercase">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'" align="end" :side-offset="4">
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage v-if="user?.avatar" :src="user?.avatar" :alt="user.name" />
                <AvatarFallback class="rounded-lg uppercase text-xs">
                  {{ user.name.slice(0, 2) }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold first-letter:uppercase">{{ user.name }}</span>
                <span class="truncate text-xs">{{ user.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <!-- <DropdownMenuGroup>
            <DropdownMenuItem @click="navigateTo('')">
              <Sparkles />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator /> -->
          <DropdownMenuGroup>
            <DropdownMenuItem @click="navigateTo('/dashboard/settings/profile')">
              <CircleUser />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem @click="navigateTo('/dashboard/settings/subscriptions')">
              <CreditCard />
              Subscriptions
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="emit('logout')">
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
