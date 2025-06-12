<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <div class="flex items-center gap-2">
          <div class="p-2 bg-red-100 rounded-full">
            <AlertTriangle class="h-5 w-5 text-red-600" />
          </div>
          <DialogTitle>{{ title || 'Something went wrong' }}</DialogTitle>
        </div>
        <DialogDescription class="space-y-3">
          <p>{{ message || 'An unexpected error occurred. Please try again.' }}</p>

          <div v-if="showDetails && details" class="rounded-lg bg-muted p-3">
            <p class="text-xs font-medium text-muted-foreground mb-2">Error Details:</p>
            <p class="text-xs font-mono text-muted-foreground">{{ details }}</p>
          </div>

          <div v-if="suggestion" class="rounded-md bg-blue-50 p-3 text-sm">
            <p class="font-medium text-blue-900">💡 Suggestion:</p>
            <p class="mt-1 text-blue-700">{{ suggestion }}</p>
          </div>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter class="flex gap-2">
        <Button variant="outline" @click="closeDialog">
          {{ cancelText || 'Close' }}
        </Button>
        <Button v-if="actionText && actionHandler" @click="handleAction">
          {{ actionText }}
        </Button>
        <Button v-else @click="closeDialog">
          {{ primaryText || 'Try Again' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';

interface Props {
  open: boolean;
  title?: string;
  message?: string;
  details?: string;
  suggestion?: string;
  showDetails?: boolean;
  cancelText?: string;
  primaryText?: string;
  actionText?: string;
  actionHandler?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  'retry': [];
}>();

function closeDialog() {
  emit('update:open', false);
}

function handleAction() {
  if (props.actionHandler) {
    props.actionHandler();
  }
  closeDialog();
}
</script>
