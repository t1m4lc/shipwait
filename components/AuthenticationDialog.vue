<template>
  <AlertDialog v-model:open="isOpen">
    <AlertDialogContent class="max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle class="flex items-center gap-2">
          <div class="p-2 bg-blue-100 rounded-full">
            <UserPlus class="size-5 text-blue-600" />
          </div>
          Authentication Required
        </AlertDialogTitle>
        <AlertDialogDescription class="space-y-3">
          <p>To subscribe to our Pro plan, you need to be signed in to your account.</p>
          <div class="rounded-md bg-blue-50 p-3 text-sm">
            <p class="font-medium text-blue-900">Why do we need this?</p>
            <ul class="mt-1 text-blue-700 list-disc list-inside space-y-1">
              <li>Secure payment processing</li>
              <li>Access to your subscription dashboard</li>
              <li>Manage your billing and features</li>
            </ul>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class="flex-col sm:flex-row gap-2">
        <AlertDialogCancel @click="handleCancel" class="w-full sm:w-auto">
          Maybe Later
        </AlertDialogCancel>
        <div class="flex gap-2 w-full sm:w-auto">
          <Button @click="handleLogin" variant="outline" class="flex-1 sm:flex-none">
            Sign In
          </Button>
          <Button @click="handleRegister" class="flex-1 sm:flex-none">
            Create Account
          </Button>
        </div>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { UserPlus } from 'lucide-vue-next';

interface Props {
  open: boolean;
  returnUrl?: string;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  returnUrl: '/pricing'
});

const emit = defineEmits<Emits>();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const handleCancel = () => {
  isOpen.value = false;
};

const handleLogin = async () => {
  isOpen.value = false;
  const redirectUrl = props.returnUrl ? `?redirect=${encodeURIComponent(props.returnUrl)}` : '';
  await navigateTo(`/login${redirectUrl}`);
};

const handleRegister = async () => {
  isOpen.value = false;
  const redirectUrl = props.returnUrl ? `?redirect=${encodeURIComponent(props.returnUrl)}` : '';
  await navigateTo(`/register${redirectUrl}`);
};
</script>
