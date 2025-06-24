<template>
  <div class="space-y-3">
    <!-- Compact Email Limit Info -->
    <div class="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
      <div class="flex items-center gap-2">
        <Mail class="h-4 w-4 text-muted-foreground" />
        <span class="text-sm">
          {{ emailCount }} / {{ limitInfo.limit === 'unlimited' ? '∞' : limitInfo.limit }} emails
        </span>
        <span v-if="limitInfo.limit !== 'unlimited'" class="text-xs text-muted-foreground">
          ({{ limitInfo.remaining || 0 }} remaining)
        </span>
      </div>

      <!-- Compact Upgrade Button -->
      <div class="flex items-center gap-2">
        <span v-if="limitInfo.limit !== 'unlimited'" class="text-xs text-muted-foreground">
          Free Plan
        </span>
        <Button v-if="limitInfo.limit !== 'unlimited'" size="sm" variant="outline" class="h-7 px-2 text-xs" as-child>
          <NuxtLink to="/pricing">
            <Crown class="h-3 w-3 mr-1" />
            Go Pro
          </NuxtLink>
        </Button>
      </div>
    </div>

    <!-- Only show critical warning when at limit -->
    <Alert v-if="!canCollectMore" class="border-red-200 bg-red-50">
      <AlertTriangle class="h-4 w-4" />
      <AlertTitle class="text-sm">Limit Reached</AlertTitle>
      <AlertDescription class="text-xs">
        Upgrade to Pro for unlimited email collection.
      </AlertDescription>
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle, Crown, Mail } from 'lucide-vue-next';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';

interface Props {
  projectId: string;
}

const props = defineProps<Props>();

const {
  emailCount,
  limitInfo,
  canCollectMore,
} = useEmailCollectionLimits(props.projectId);
</script>
