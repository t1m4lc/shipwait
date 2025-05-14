<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { Check, Circle, Dot, Loader2, MessageCircle, ExternalLink, XCircle } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import * as z from 'zod'
import type { Database, Tables } from '~/types/supabase'
import generateSnippet from '~/utils/snippet'

interface CreatedProject {
    id: string;
}

const generalSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    domain: z.string().min(1, 'Domain is required').regex(
        domainRegex,
        { message: 'Must be a valid domain (e.g., example.com).' }
    ),
});

const behaviorSchema = z.object({
    behaviour_type: z.enum(['show_message', 'redirect', 'do_nothing'], {
        required_error: 'Please select a submit behaviour'
    }),
    message: z.string().optional().default('Thank you for joining the waitlist!'),
    redirect_url: z.string().optional(),
});

// Create a combined schema for form validation
const formSchema = generalSchema.merge(behaviorSchema)
    .superRefine((data, ctx) => {
        if (data.behaviour_type === 'show_message' && (!data.message || data.message.length === 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Message is required',
                path: ['message'],
            })
        }
        if (data.behaviour_type === 'redirect') {
            if (!data.redirect_url || data.redirect_url.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'URL is required',
                    path: ['redirect_url'],
                })
            } else {
                try {
                    new URL(data.redirect_url)
                } catch {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'URL invalid',
                        path: ['redirect_url'],
                    })
                }
            }
        }
    });

type FormValues = z.infer<typeof formSchema>;

const formSchemas = [
    toTypedSchema(generalSchema),
    toTypedSchema(behaviorSchema)
];

const stepIndex = ref(1)
const createdProject = ref<CreatedProject | null>(null)
const isSubmitting = ref(false)

const { values, meta, validate } = useForm<FormValues>({
    validationSchema: computed(() => formSchemas[stepIndex.value - 1]),
    initialValues: {
        name: '',
        domain: '',
        behaviour_type: 'show_message',
        message: 'Thank you for joining the waitlist!',
        redirect_url: '',
    },
    keepValuesOnUnmount: true,
});

const snippet = computed(() => {
    console.log('Computing snippet with createdProject:', createdProject.value);

    if (!createdProject.value) return '';
    if (!createdProject.value.id) {
        console.warn('Missing required project properties:', createdProject.value);
        return '';
    }

    const result = generateSnippet(createdProject.value.id);
    console.log('Generated snippet result:', result);
    return result;
});

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

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const createProject = async (payload: Partial<Tables<'projects'>>) => {
    console.log("payload", payload);

    if (!payload.domain || !payload.name || !user.value?.id) {
        return { data: null, error: { message: 'Missing required fields' } }
    }

    const insertPayload = {
        ...payload,
        domain: payload.domain as string,
        name: payload.name as string,
        user_id: user.value.id as string
    }

    return await client
        .from('projects')
        .insert(insertPayload)
        .select(`id`)
        .single()
}

const createSubmissionBehaviour = async (project_id: string, payload: Omit<Tables<'submission_behaviors'>, 'id' | 'created_at' | 'project_id'>) => {
    return await client
        .from('submission_behaviors')
        .insert({ ...payload, project_id })
}

async function onSubmit(): Promise<void> {
    isSubmitting.value = true

    const { name, domain, behaviour_type, message, redirect_url } = values;

    const { error, data: project } = await createProject({ name, domain })

    console.log('project', project);


    if (project) {
        // Set created project ID for the snippet
        createdProject.value = { ...project };

        console.log('createdProject value:', createdProject.value);
        const { error: behaviourError } = await createSubmissionBehaviour(
            project.id,
            {
                behavior_type: behaviour_type,
                message: message ?? null,
                redirect_url: redirect_url ?? null
            }
        )

        if (!behaviourError) {
            toast('Project created successfully!', {
                description: 'Your new project has been created and settings saved.',
            });

            stepIndex.value = 3
        } else {
            toast('Project created but behaviour not set', {
                description: behaviourError.message || 'An error occurred while creating submit behaviour.',
            });
        }
    } else {
        toast('Project creation failed', {
            description: error?.message || 'An error occurred while creating the project.',
        });
    }

    isSubmitting.value = false
}

// Handle navigation between steps
async function handleNextStep() {
    const result = await validate();
    if (result.valid) {
        if (stepIndex.value === 2) {
            await onSubmit();
        } else {
            stepIndex.value++;
        }
    }
}

function handlePrevStep() {
    if (stepIndex.value > 1) {
        stepIndex.value--;
    }
}
</script>

<template>
    <form @submit.prevent="handleNextStep">
        <Stepper v-model="stepIndex" class="block w-full">
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
                                <Input type="text" v-bind="componentField" @keydown.enter.prevent="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="domain">
                        <FormItem>
                            <FormLabel>Domain</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" @keydown.enter.prevent="handleNextStep" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </template>

                <template v-if="stepIndex === 2">
                    <FormField v-slot="{ componentField }" name="behaviour_type">
                        <FormItem>
                            <FormLabel>Submit behaviour</FormLabel>

                            <FormControl>
                                <RadioGroup class="flex justify-start gap-8 pt-2" v-bind="componentField">
                                    <FormItem>
                                        <FormLabel
                                            class="[&:has([data-state=checked])>div]:border-primary flex flex-col items-center cursor-pointer">
                                            <FormControl>
                                                <RadioGroupItem value="show_message" class="sr-only" />
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
                                                <RadioGroupItem value="do_nothing" class="sr-only" />
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
                    <FormField v-if="values.behaviour_type === 'show_message'" v-slot="{ componentField }"
                        name="message">
                        <FormItem>
                            <FormLabel>Message to display</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-if="values.behaviour_type === 'redirect'" v-slot="{ componentField }"
                        name="redirect_url">
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
                            <CodeDisplay language="html" :lineNumbers="true" :with-copy="true">
                                {{ snippet.toString() }}
                            </CodeDisplay>
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
                <Button v-else-if="stepIndex < 3" :disabled="isSubmitting" variant="outline" size="sm"
                    @click="handlePrevStep">
                    Back
                </Button>
                <div v-else></div>

                <div class="flex items-center gap-3" :class="stepIndex === 3 ? 'justify-center w-full' : ''">
                    <Button v-if="stepIndex === 1" type="button" :disabled="!meta.valid" size="sm"
                        @click="handleNextStep">
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
        </Stepper>
    </form>
</template>