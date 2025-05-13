<script setup lang="ts">

import { toTypedSchema } from '@vee-validate/zod'
import { Check, Circle, Dot } from 'lucide-vue-next'
import { h, ref, markRaw } from 'vue'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const formSchema = [
    z.object({
        name: z.string().min(1, 'Project name is required'),
        domain: z.string().min(1, 'Domain is required').url('Domain must be a valid URL'),
    }),
    z.object({
        submitBehaviour: z.enum(['message', 'redirect', 'none'], { required_error: 'Please select a submit behaviour' }),
        message: z.string().optional(),
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
const steps = [
    {
        step: 1,
        title: 'Details',
        description: 'Enter the project name and domain',
    },
    {
        step: 2,
        title: 'Submit behavior',
        description: 'Choose what happens after a user subscribes',
    },
]

function onSubmit(values: any) {
    alert(JSON.stringify(values, null, 2));

    navigateTo('/')
}
</script>

<template>
    <Form v-slot="{ meta, values, validate }" keep-values
        :validation-schema="toTypedSchema(formSchema[stepIndex - 1])">
        <Stepper v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }" v-model="stepIndex"
            class="block w-full">
            <form @submit="(e) => {
                e.preventDefault()
                validate()

                if (stepIndex === steps.length && meta.valid) {
                    onSubmit(values)
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
                                :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
                                :disabled="state !== 'completed' && !meta.valid">
                                <Check v-if="state === 'completed'" class="size-5" />
                                <Circle v-if="state === 'active'" />
                                <Dot v-if="state === 'inactive'" />
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
                                    <Input type="text" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="domain">
                            <FormItem>
                                <FormLabel>Domain</FormLabel>
                                <FormControl>
                                    <Input type="text" v-bind="componentField" />
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
                                    <RadioGroup v-bind="componentField" class="flex gap-4">
                                        <RadioGroupItem value="message" id="message" />
                                        <FormLabel for="message">Message</FormLabel>
                                        <RadioGroupItem value="redirect" id="redirect" />
                                        <FormLabel for="redirect">Redirect</FormLabel>
                                        <RadioGroupItem value="none" id="none" />
                                        <FormLabel for="none">None</FormLabel>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-if="values.submitBehaviour === 'message'" v-slot="{ componentField }" name="message">
                            <FormItem>
                                <FormLabel>Message to display</FormLabel>
                                <FormControl>
                                    <Input type="text" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-if="values.submitBehaviour === 'redirect'" v-slot="{ componentField }" name="redirectUrl">
                            <FormItem>
                                <FormLabel>Redirection URL</FormLabel>
                                <FormControl>
                                    <Input type="url" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </template>
                </div>

                <div class="flex items-center justify-between mt-4">
                    <NuxtLink v-if="stepIndex === 1" to="/">
                        <Button variant="outline" size="sm">
                            Abort
                        </Button>
                    </NuxtLink>

                    <Button v-else :disabled="isPrevDisabled" variant="outline" size="sm" @click="prevStep()">
                        Back
                    </Button>

                    <div class="flex items-center gap-3">
                        <Button v-if="stepIndex !== 2" :type="meta.valid ? 'button' : 'submit'"
                            :disabled="isNextDisabled" size="sm" @click="meta.valid && nextStep()">
                            Next
                        </Button>
                        <Button v-if="stepIndex === 2" size="sm" type="submit">
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </Stepper>
    </Form>
</template>