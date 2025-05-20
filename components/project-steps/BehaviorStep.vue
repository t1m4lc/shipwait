<script setup lang="ts">
import { Ban, ExternalLink, MessageCircle } from 'lucide-vue-next';

defineProps<{
  behaviourType: 'show_message' | 'redirect' | 'do_nothing'
  message: string
  redirectUrl: string
}>()

const emit = defineEmits<{
  'update:behaviourType': [value: 'show_message' | 'redirect' | 'do_nothing']
  'update:message': [value: string]
  'update:redirectUrl': [value: string]
}>()

const behaviors = [
  {
    id: 'show_message',
    name: 'Show Message',
    description: 'Show a message to your users after they submit',
    icon: MessageCircle,
  },
  {
    id: 'redirect',
    name: 'Redirect',
    description: 'Redirect your users to another page',
    icon: ExternalLink,
  },
  {
    id: 'do_nothing',
    name: 'Do Nothing',
    description: 'Just collect emails without action',
    icon: Ban,
  },
] as const
</script>

<template>
  <div class="flex flex-col gap-6">
    <FormField v-slot="{ componentField }" name="behaviour_type">
      <FormItem class="space-y-3">
        <FormLabel>After Submit Behavior</FormLabel>
        <FormDescription>
          What should happen after someone submits the form?
        </FormDescription>
        <RadioGroup v-bind="componentField" :value="behaviourType" @update:modelValue="emit('update:behaviourType', $event as 'show_message' | 'redirect' | 'do_nothing')" class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <FormItem v-for="behavior in behaviors" :key="behavior.id" class="group">
            <FormLabel class="w-full cursor-pointer">
              <FormControl>
                <RadioGroupItem :value="behavior.id" class="sr-only" />
              </FormControl>
              <Card class="transition-colors size-full duration-200 flex flex-col items-center h-full border-primary/20 hover:border-primary group-has-[[data-state=checked]]:border-primary group-has-[[data-state=checked]]:bg-primary/5">
                <CardHeader class="w-full">
                  <CardTitle class="text-sm flex items-center justify-between">
                    {{ behavior.name }}
                    <component :is="behavior.icon" class="size-4" />
                  </CardTitle>
                  <CardDescription>
                    {{ behavior.description }}
                  </CardDescription>
                </CardHeader>
              </Card>
            </FormLabel>
          </FormItem>
        </RadioGroup>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-if="behaviourType === 'show_message'" v-slot="{ componentField }" name="message">
      <FormItem>
        <FormLabel>Message</FormLabel>
        <FormControl>
          <Textarea v-bind="componentField" :value="message" @input="(e) => emit('update:message', (e.target as HTMLTextAreaElement).value)" placeholder="Thank you for joining the waitlist!" class="resize-none" />
        </FormControl>
        <FormDescription>
          This message will be shown after form submission.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-if="behaviourType === 'redirect'" v-slot="{ componentField }" name="redirect_url">
      <FormItem>
        <FormLabel>Redirect URL</FormLabel>
        <FormControl>
          <Input v-bind="componentField" :value="redirectUrl" @input="(e) => emit('update:redirectUrl', (e.target as HTMLInputElement).value)" placeholder="https://example.com/thanks" />
        </FormControl>
        <FormDescription>
          Users will be redirected to this URL after form submission.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>
