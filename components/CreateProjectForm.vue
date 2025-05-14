<script setup lang="ts">

import { toTypedSchema } from '@vee-validate/zod'
import { Check, Circle, Dot, Loader2, MessageCircle, ExternalLink, XCircle } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const formSchema = [
    z.object({
        name: z.string().min(1, 'Project name is required'),
        domain: z.string().min(1, 'Domain is required').url('Domain must be a valid URL'),
    }),
    z.object({
        submitBehaviour: z.enum(['message', 'redirect', 'none'], { required_error: 'Please select a submit behaviour' }),
        message: z.string().optional().default('Thank you for joining the waitlist!'),
        redirectUrl: z.string().optional(),
    }).superRefine((data, ctx) => {
        if (data.submitBehaviour === 'message' && (!data.message || data.message.length === 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Message is required',
                path: ['message'],
            })
        }
        if (data.submitBehaviour === 'redirect') {
            if (!data.redirectUrl || data.redirectUrl.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'URL is required',
                    path: ['redirectUrl'],
                })
            } else {
                try {
                    new URL(data.redirectUrl)
                } catch {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'URL invalide',
                        path: ['redirectUrl'],
                    })
                }
            }
        }
    }),
]

const stepIndex = ref(1)
const createdProject = ref<any>(null)
const isSubmitting = ref(false)

const snippet = computed(() => {
    if (!createdProject.value) return ''
    return `<script defer src="https://cdn.monwaitlist.io/waitlist.js?project=${createdProject.value.id}&token=${createdProject.value.token}"><\/script>`
})
const steps = [
    {
        step: 1,
        title: 'General',
        description: 'Basic informations',
    },
    {
        step: 2,
        title: 'Behavior',
        description: 'After someone subscribes',
    },
    {
        step: 3,
        title: 'Configure',
        description: 'Connect to your site',
    },
]

async function onSubmit(values: any) {
    isSubmitting.value = true

    try {
        // Replace with actual API call
        // const { data } = await $fetch('/api/projects/create', { method: 'POST', body: values })
        // createdProject.value = data.project

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Simulate successful project creation
        createdProject.value = {
            id: 'demo-' + Math.random().toString(36).substring(2, 8),
            name: values.name,
            domain: values.domain,
            token: 'demo-token-' + Math.random().toString(36).substring(2, 8)
        }

    } catch (e) {
        toast.error('Failed to create project')
    } finally {
        stepIndex.value = 3
        isSubmitting.value = false
    }
}
</script>

<template>
    <Form v-slot="{ meta, values, validate }" keep-values
        :validation-schema="toTypedSchema(formSchema[stepIndex - 1] || formSchema[0])" :initial-values="{
            name: '',
            domain: '',
            submitBehaviour: 'message',
            message: 'Thank you for joining the waitlist!',
            redirectUrl: ''
        }">
        <Stepper v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }" v-model="stepIndex"
            class="block w-full">
            <form @submit.prevent="async () => {
                await validate()
                if (stepIndex === 2 && meta.valid) {
                    await onSubmit(values)
                }
            }">
                <div class="flex w-full flex-start gap-2">
                    <StepperItem v-for="step in steps" :key="step.step" v-slot="{ state }"
                        class="relative flex w-full flex-col items-center justify-center" :step="step.step">
                        <StepperSeparator v-if="step.step !== steps[steps.length - 1].step"
                            class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary" />


                        <StepperTrigger as-child>
                            <Button :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                                size="icon" class="z-10 rounded-full shrink-0"
                                :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']">
                                <Check v-if="state === 'completed'" class="size-5" />
                                <Loader2 v-else-if="isSubmitting && step.step === 2" class="size-5 animate-spin" />
                                <Circle v-else-if="state === 'active'" />
                                <Dot v-else-if="state === 'inactive'" />
                            </Button>
                        </StepperTrigger>

                        <div class="mt-5 flex flex-col items-center text-center">
                            <StepperTitle :class="[state === 'active' && 'text-primary']"
                                class="text-sm font-semibold transition lg:text-base">
                                {{ step.title }}
                            </StepperTitle>
                            <StepperDescription :class="[state === 'active' && 'text-primary']"
                                class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm">
                                {{ step.description }}
                            </StepperDescription>
                        </div>
                    </StepperItem>
                </div>

                <div class="flex flex-col gap-4 mt-4">
                    <template v-if="stepIndex === 1">
                        <FormField v-slot="{ componentField }" name="name">
                            <FormItem>
                                <FormLabel>Project Name</FormLabel>
                                <FormControl>
                                    <Input type="text" v-bind="componentField" @keydown.enter.prevent="async () => {
                                        await validate();
                                        if (meta.valid) nextStep();
                                    }" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="domain">
                            <FormItem>
                                <FormLabel>Domain</FormLabel>
                                <FormControl>
                                    <Input type="text" v-bind="componentField" @keydown.enter.prevent="async () => {
                                        await validate();
                                        if (meta.valid) nextStep();
                                    }" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </template>

                    <template v-if="stepIndex === 2">
                        <FormField v-slot="{ componentField }" name="submitBehaviour">
                            <FormItem>
                                <FormLabel>Submit behaviour</FormLabel>

                                <FormControl>
                                    <RadioGroup class="flex justify-start gap-8 pt-2" v-bind="componentField">
                                        <FormItem>
                                            <FormLabel
                                                class="[&:has([data-state=checked])>div]:border-primary flex flex-col items-center cursor-pointer">
                                                <FormControl>
                                                    <RadioGroupItem value="message" class="sr-only" />
                                                </FormControl>

                                                <div
                                                    class="flex h-16 w-16 items-center justify-center rounded-md border-2 bg-accent transition-colors ">
                                                    <MessageCircle class="h-6 w-6" />
                                                </div>

                                                <span class="text-sm font-medium">Message</span>
                                            </FormLabel>
                                        </FormItem>

                                        <FormItem>
                                            <FormLabel
                                                class="[&:has([data-state=checked])>div]:border-primary flex flex-col items-center cursor-pointer">
                                                <FormControl>
                                                    <RadioGroupItem value="redirect" class="sr-only" />
                                                </FormControl>

                                                <div
                                                    class="flex h-16 w-16 items-center justify-center rounded-md border-2 bg-accent transition-colors ">
                                                    <ExternalLink class="h-6 w-6" />
                                                </div>

                                                <span class="text-sm font-medium">Redirect</span>
                                            </FormLabel>
                                        </FormItem>

                                        <FormItem>
                                            <FormLabel
                                                class="[&:has([data-state=checked])>div]:border-primary flex flex-col items-center cursor-pointer">
                                                <FormControl>
                                                    <RadioGroupItem value="none" class="sr-only" />
                                                </FormControl>

                                                <div
                                                    class="flex h-16 w-16 items-center justify-center rounded-md border-2 bg-accent transition-colors ">
                                                    <XCircle class="h-6 w-6" />
                                                </div>

                                                <span class="text-sm font-medium">None</span>
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-if="values.submitBehaviour === 'message'" v-slot="{ componentField }"
                            name="message">
                            <FormItem>
                                <FormLabel>Message to display</FormLabel>
                                <FormControl>
                                    <Input type="text" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-if="values.submitBehaviour === 'redirect'" v-slot="{ componentField }"
                            name="redirectUrl">
                            <FormItem>
                                <FormLabel>Redirection URL</FormLabel>
                                <FormControl>
                                    <Input type="url" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </template>

                    <template v-if="stepIndex === 3">
                        <div class="flex flex-col items-center gap-6 py-4">
                            <div class="text-center">
                                <h3 class="text-lg font-semibold mb-2">Project created 🎉</h3>
                                <p class="text-muted-foreground">
                                    1- Add the code snippet to your website's <code>&lt;head&gt;</code> section.
                                </p>
                                <p class="text-muted-foreground">
                                    2- Add the <code>data-waitly</code> attribute to your email input to bind to Waitly
                                    script.
                                </p>
                            </div>

                            <div class="w-full max-w-2xl">
                                <CodeDisplay language="html" :lineNumbers="true" :content="snippet" />
                            </div>
                        </div>
                    </template>
                </div>

                <div class="flex items-center justify-between mt-8">
                    <NuxtLink v-if="stepIndex === 1" to="/dashboard">
                        <Button variant="outline" size="sm">
                            Cancel
                        </Button>
                    </NuxtLink>
                    <Button v-else-if="stepIndex < 3" :disabled="isPrevDisabled || isSubmitting" variant="outline"
                        size="sm" @click="prevStep()">
                        Back
                    </Button>
                    <div v-else></div>

                    <div class="flex items-center gap-3" :class="stepIndex === 3 ? 'justify-center w-full' : ''">
                        <Button v-if="stepIndex === 1" type="button" :disabled="isNextDisabled" size="sm"
                            @click="meta.valid && nextStep()">
                            Next
                        </Button>
                        <Button v-if="stepIndex === 2" size="sm" type="submit" :disabled="!meta.valid || isSubmitting">
                            <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
                            Create Project
                        </Button>
                        <NuxtLink v-if="stepIndex === 3" :to="`/dashboard/projects/${createdProject?.id}`">
                            <Button size="sm" variant="default">Go to Dashboard</Button>
                        </NuxtLink>
                    </div>
                </div>
            </form>
        </Stepper>
    </Form>
</template>