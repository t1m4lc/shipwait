<template>
  <SettingsLayout>
    <div class="space-y-8">
      <!-- Profile Information Section -->
      <div>
        <h3 class="text-lg font-medium">Profile Information</h3>
        <p class="text-sm text-muted-foreground">
          Update your account profile information and email address.
        </p>

        <Card class="mt-6">
          <CardContent class="pt-6">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="email">Email</Label>
                  <Input id="email" :placeholder="userStore.userData?.email || ''" disabled class="bg-muted" />
                  <p class="text-xs text-muted-foreground mt-1">
                    Email cannot be changed at this time
                  </p>
                </div>
                <div>
                  <Label for="user-id">User ID</Label>
                  <Input id="user-id" :placeholder="userStore.userData?.id || ''" disabled class="bg-muted font-mono text-xs" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Account Activity Section -->
      <div>
        <h3 class="text-lg font-medium">Account Activity</h3>
        <p class="text-sm text-muted-foreground">
          Overview of your account usage and statistics.
        </p>

        <Card class="mt-6">
          <CardContent class="pt-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <p class="text-sm font-medium">Projects Created</p>
                <p class="text-2xl font-bold">{{ projectsStore.projects.length }}</p>
              </div>
              <div class="space-y-2">
                <p class="text-sm font-medium">Account Type</p>
                <Badge :variant="subscriptionStore.isActive ? 'default' : 'secondary'">
                  {{ subscriptionStore.isActive ? 'Pro' : 'Free' }}
                </Badge>
              </div>
              <div class="space-y-2">
                <p class="text-sm font-medium">Member Since</p>
                <p class="text-sm text-muted-foreground">
                  {{ userStore.memberSince }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Danger Zone -->
      <div class="pt-8">
        <div class="border border-destructive rounded-lg p-6">
          <h3 class="text-lg font-semibold text-destructive mb-2">Delete Account</h3>
          <p class="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          <Button variant="destructive" @click="showDeleteDialog = true" :disabled="userStore.isDeleting">
            <UserX v-if="!userStore.isDeleting" class="w-4 h-4 mr-2" />
            <Loader2 v-else class="w-4 h-4 mr-2 animate-spin" />
            {{ userStore.isDeleting ? 'Deleting Account...' : 'Delete Account' }}
          </Button>

          <!-- Delete Confirmation Dialog -->
          <Dialog v-model:open="showDeleteDialog">
            <DialogContent class="sm:max-w-md">
              <DialogHeader>
                <DialogTitle class="flex items-center gap-2">
                  <AlertTriangle class="h-5 w-5 text-destructive" />
                  Delete Account
                </DialogTitle>
                <DialogDescription class="space-y-3">
                  <p class="text-sm">
                    <strong>This action cannot be undone.</strong> This will permanently delete your account and all associated data.
                  </p>

                  <div class="p-3 bg-muted rounded-md">
                    <p class="font-medium text-sm mb-2">The following will be permanently deleted:</p>
                    <ul class="text-sm space-y-1">
                      <li>• {{ projectsStore.projects.length }} project(s)</li>
                      <li>• All leads and submission data</li>
                      <li>• All pages and configurations</li>
                      <li>• Your subscription and billing history</li>
                    </ul>
                  </div>

                  <div>
                    <p class="text-sm mb-2">
                      Please type <code class="px-1 py-0.5 bg-muted rounded text-xs">DELETE</code> to confirm:
                    </p>
                    <Input v-model="deleteConfirmation" placeholder="Type DELETE to confirm" class="font-mono" />
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" @click="showDeleteDialog = false">
                  Cancel
                </Button>
                <Button variant="destructive" @click="handleDeleteAccount" :disabled="deleteConfirmation !== 'DELETE' || userStore.isDeleting">
                  <UserX v-if="!userStore.isDeleting" class="w-4 h-4 mr-2" />
                  <Loader2 v-else class="w-4 h-4 mr-2 animate-spin" />
                  {{ userStore.isDeleting ? 'Deleting...' : 'Delete Account Permanently' }}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  </SettingsLayout>
</template>

<script setup lang="ts">
import { AlertTriangle, Loader2, UserX } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'dashboard'
});

const userStore = useUserStore();
const projectsStore = useProjectsStore();
const subscriptionStore = useSubscriptionStore();

const showDeleteDialog = ref(false);
const deleteConfirmation = ref('');

/**
 * Handle account deletion using the user store method
 */
const handleDeleteAccount = async () => {
  if (deleteConfirmation.value !== 'DELETE') {
    toast.error('Please type DELETE to confirm');
    return;
  }

  const result = await userStore.deleteAccount();

  if (result.success) {
    toast.success('Account deleted successfully. You will be redirected.');
    showDeleteDialog.value = false;
    deleteConfirmation.value = '';
  } else {
    toast.error(result.error || 'Failed to delete account');
  }
};

// Reset confirmation when dialog closes
watch(showDeleteDialog, (isOpen) => {
  if (!isOpen) {
    deleteConfirmation.value = '';
  }
});
</script>