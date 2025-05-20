<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useDebounce, useDebounceFn } from '@vueuse/core'
import { Check, Circle, Dot, ExternalLink, Loader2, MessageCircle, XCircle } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import * as z from 'zod'
import { SLUG_PATTERN } from '~/utils/regex'
import { checkSlugAvailability, generateSlug } from '~/utils/slug'
import generateSnippet from '~/utils/snippet'

type SlugCheckState = 'not-set' | 'loading' | 'available' | 'unavailable';

interface CreatedProject {
    id: string;
    slug: string;
}

const generalSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    slug: z.string().min(1, 'Project slug is required')
        .regex(SLUG_PATTERN, 'Slug must contain only lowercase letters, numbers, and hyphens')
        .max(100, 'Slug must be 100 characters or less'),
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
const slugCheckState = ref<SlugCheckState>('not-set')
const suggestedSlug = ref('')

// Create debounced function for slug checking
const debouncedCheckSlug = useDebounceFn(async (slug: string) => {
    if (!slug) {
        slugCheckState.value = 'not-set';
        return;
    }

    slugCheckState.value = 'loading';
    const result = await checkSlugAvailability(slug);

    if (result.available) {
        slugCheckState.value = 'available';
    } else {
        slugCheckState.value = 'unavailable';
        suggestedSlug.value = result.suggestedSlug;

        // If slug isn't available, suggest the alternative
        setFieldValue('slug', result.suggestedSlug);
        // Set to available since we've updated to the suggested slug
        slugCheckState.value = 'available';
    }
}, 1000)

const { values, meta, validate, setFieldValue } = useForm<FormValues>({
    validationSchema: computed(() => formSchemas[stepIndex.value - 1]),
    initialValues: {
        name: '',
        slug: '',
        behaviour_type: 'show_message',
        message: 'Thank you for joining the waitlist!',
        redirect_url: '',
    },
    keepValuesOnUnmount: true,
});


const snippet = computed(() => {
    if (!createdProject.value) return '';
    if (!createdProject.value.id) {
        console.warn('Missing required project properties:', createdProject.value);
        return '';
    }

    return generateSnippet(createdProject.value.id);
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

const store = useProjectsStore()
const { projects } = storeToRefs(store)

async function onSubmit(): Promise<void> {
    isSubmitting.value = true

    const { name, slug, behaviour_type, message, redirect_url } = values;

    // Use the store method instead of direct API calls
    const { data: project, error } = await store.createProject(
        { name, slug },
        {
            behavior_type: behaviour_type,
            message: message ?? null,
            redirect_url: redirect_url ?? null
        }
    );

    if (project) {
        createdProject.value = { id: project.id, slug: project.slug };

        toast('Project created successfully!', {
            description: 'Your new project has been created and settings saved.',
        });

        stepIndex.value = 3;
    } else {
        toast('Project creation failed', {
            description: typeof error === 'object' && error !== null && 'message' in error 
                ? String(error.message) 
                : 'An error occurred while creating the project.',
        });
    }

    isSubmitting.value = false;
}

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


const checkSlug = useDebounceFn(async (slug: string) => {
    if (!slug) return;

    slugCheckState.value = 'loading';
    debouncedCheckSlug(slug);
}, 1000)


// Update slug when name changes
async function updateSlugFromName() {
    const generatedSlug = generateSlug(values.name);
    setFieldValue('slug', generatedSlug);
    slugCheckState.value = 'loading';
    debouncedCheckSlug(generatedSlug);
}
</script>

<template>
    <form @submit.prevent="handleNextStep">
        <Stepper v-model="stepIndex" class="block w-full">
            <div class="flex w-full flex-start gap-2">
                <StepperItem v-for="step in steps" :key="step.step" v-slot="{ state }" class="relative flex w-full flex-col items-center justify-center" :step="step.step">
                    <StepperSeparator v-if="step.step !== steps[steps.length - 1].step" class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary" />

                    <StepperTrigger as-child :disabled="step.step > stepIndex && !meta.valid">
                        <Button :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'" size="icon" class="z-10 rounded-full shrink-0" :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']" :disabled="step.step > stepIndex && !meta.valid">
                            <Check v-if="state === 'completed'" class="size-5" />
                            <Loader2 v-else-if="isSubmitting && step.step === 2" class="size-5 animate-spin" />
                            <Circle v-else-if="state === 'active'" />
                            <Dot v-else-if="state === 'inactive'" />
                        </Button>
                    </StepperTrigger>

                    <div class="mt-5 flex flex-col items-center text-center">
                        <StepperTitle :class="[state === 'active' && 'text-primary']" class="text-sm font-semibold transition lg:text-base">
                            {{ step.title }}
                        </StepperTitle>
                        <StepperDescription :class="[state === 'active' && 'text-primary']" class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm">
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
                                <Input type="text" v-bind="componentField" @input="updateSlugFromName" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="slug">
                        <FormItem>
                            <FormLabel>Project Slug</FormLabel>

                            <div class="flex items-center gap-2">
                                <FormControl>
                                    <Input type="text" v-bind="componentField" @input="checkSlug(values.slug)" :disabled="slugCheckState === 'loading' || !values.slug.trim().length" />
                                </FormControl>
                                <div v-if="slugCheckState === 'loading'" class="flex items-center text-muted-foreground">
                                    <Loader2 class="animate-spin size-4 mr-1" />
                                    Checking...
                                </div>
                                <div v-else-if="slugCheckState === 'unavailable'" class="flex items-center text-destructive">
                                    <XCircle class="size-4 mr-1" />
                                    Not available
                                </div>
                                <div v-else-if="slugCheckState === 'available' && values.slug" class="flex items-center text-success">
                                    <Check class="size-4 mr-1" />
                                    Available
                                </div>
                            </div>
                            <FormDescription>
                                Used in URLs for your project. Only lowercase letters, numbers, and hyphens.
                            </FormDescription>
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
                                        <FormLabel class="[&:has([data-state=checked])>div]:border-primary flex flex-col items-center cursor-pointer">
                                            <FormControl>
                                                <RadioGroupItem value="show_message" class="sr-only" />
                                            </FormControl>

                                            <div class="flex h-16 w-16 items-center justify-center rounded-md border-2 bg-accent transition-colors ">
                                                <MessageCircle class="h-6 w-6" />
                                            </div>

                                            <span class="text-sm font-medium">Message</span>
                                        </FormLabel>
                                    </FormItem>

                                    <FormItem>
                                        <FormLabel class="[&:has([data-state=checked])>div]:border-primary flex flex-col items-center cursor-pointer">
                                            <FormControl>
                                                <RadioGroupItem value="redirect" class="sr-only" />
                                            </FormControl>

                                            <div class="flex h-16 w-16 items-center justify-center rounded-md border-2 bg-accent transition-colors ">
                                                <ExternalLink class="h-6 w-6" />
                                            </div>

                                            <span class="text-sm font-medium">Redirect</span>
                                        </FormLabel>
                                    </FormItem>

                                    <FormItem>
                                        <FormLabel class="[&:has([data-state=checked])>div]:border-primary flex flex-col items-center cursor-pointer">
                                            <FormControl>
                                                <RadioGroupItem value="do_nothing" class="sr-only" />
                                            </FormControl>

                                            <div class="flex h-16 w-16 items-center justify-center rounded-md border-2 bg-accent transition-colors ">
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
                    <FormField v-if="values.behaviour_type === 'show_message'" v-slot="{ componentField }" name="message">
                        <FormItem>
                            <FormLabel>Message to display</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-if="values.behaviour_type === 'redirect'" v-slot="{ componentField }" name="redirect_url">
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
                                2- Add the <code>data-shipwait</code> attribute to your email input to bind to Shipwait
                                script.
                            </p>
                        </div>

                        <div class="w-full max-w-2xl">
                            <CodeDisplay language="html" :with-copy="true">
                                {{ snippet.toString() }}
                            </CodeDisplay>
                        </div>
                    </div>
                </template>
            </div>

            <div class="flex items-center mt-8 gap-4" :class="projects.length ? 'justify-between' : 'justify-end'">
                <NuxtLink v-if="stepIndex === 1 && projects.length" to="/dashboard">
                    <Button variant="outline" size="sm">
                        Cancel
                    </Button>
                </NuxtLink>
                <Button v-else-if="stepIndex === 2" :disabled="isSubmitting" variant="outline" size="sm" @click="handlePrevStep">
                    Back
                </Button>

                <div class="flex items-center gap-3" :class="stepIndex === 3 ? 'justify-center w-full' : ''">
                    <Button v-if="stepIndex === 1" type="button" :disabled="!meta.valid" size="sm" @click="handleNextStep">
                        Next
                    </Button>
                    <Button v-if="stepIndex === 2" size="sm" type="submit" :disabled="!meta.valid || isSubmitting">
                        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
                        Create Project
                    </Button>
                    <NuxtLink v-if="stepIndex === 3" :to="`/dashboard/projects/${createdProject?.slug}`">
                        <Button size="sm" variant="default">Go to Dashboard</Button>
                    </NuxtLink>
                </div>
            </div>
        </Stepper>
    </form>
</template>