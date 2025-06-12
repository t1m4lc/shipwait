<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Sparkles } from 'lucide-vue-next'

interface Props {
  open: boolean
  currentProjectCount: number
  projectLimit: number | string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

function closeDialog() {
  emit('update:open', false)
}

function goToPricing() {
  closeDialog()
  navigateTo('/pricing')
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <div class="flex items-center gap-2">
          <Crown class="h-5 w-5 text-amber-500" />
          <DialogTitle>Upgrade Required</DialogTitle>
        </div>
        <DialogDescription class="space-y-3">
          <p>
            You've reached your project limit of <strong>{{ typeof projectLimit === 'number' ? projectLimit : projectLimit }}</strong> project{{ (typeof projectLimit === 'number' ? projectLimit : 1) === 1 ? '' : 's' }}.
          </p>
          <div class="rounded-lg bg-muted p-3">
            <div class="flex items-center justify-between text-sm">
              <span>Current projects:</span>
              <Badge variant="secondary">{{ currentProjectCount }}/{{ projectLimit }}</Badge>
            </div>
          </div>
          <p class="text-sm">
            Upgrade to Pro to create unlimited projects and unlock more powerful features for your waitlist campaigns.
          </p>
        </DialogDescription>
      </DialogHeader>

      <div class="rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-950/50 dark:to-purple-950/50">
        <div class="flex items-start gap-3">
          <Sparkles class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div class="space-y-1">
            <h4 class="font-medium text-sm">Pro Plan Benefits</h4>
            <ul class="text-xs text-muted-foreground space-y-1">
              <li>• Unlimited projects</li>
              <li>• Remove "Built with Shipwait" branding</li>
              <li>• Priority support</li>
            </ul>
          </div>
        </div>
      </div>

      <DialogFooter class="flex gap-2">
        <Button variant="outline" @click="closeDialog">
          Maybe Later
        </Button>
        <Button @click="goToPricing" class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Crown class="h-4 w-4 mr-2" />
          Upgrade to Pro
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
