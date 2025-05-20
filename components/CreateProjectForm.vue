<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useDebounceFn } from '@vueuse/core'
import { Check, Circle, Dot, Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import * as z from 'zod'
import BehaviorStep from '~/components/project-steps/BehaviorStep.vue'
import ConfigureStep from '~/components/project-steps/ConfigureStep.vue'
import GeneralStep from '~/components/project-steps/GeneralStep.vue'
import { type CreatedProject, type SlugCheckState } from '~/types/project'
import { SLUG_PATTERN } from '~/utils/regex'
import { checkSlugAvailability, generateSlug } from '~/utils/slug'
import generateSnippet from '~/utils/snippet'

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
        behaviour_type: 'do_nothing',
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
        title: 'On your marks',
        description: 'Basic informations',
    },
    {
        step: 2,
        title: 'Get set',
        description: 'After someone subscribes',
    },
    {
        step: 3,
        title: 'Go!',
        description: 'Start collecting leads',
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

                    <StepperTrigger as-child :disabled="step.step > stepIndex && !meta.valid || step.title === 'Configure'">
                        <Button :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'" size="icon" class="z-10 rounded-full shrink-0" :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']" :disabled="step.step > stepIndex && !meta.valid || step.title === 'Configure'">
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

            <div class="flex flex-col gap-4 mt-4 p-8">
                <GeneralStep v-if="stepIndex === 1" :name="values.name" :slug="values.slug" :slug-check-state="slugCheckState" :suggested-slug="suggestedSlug" @update:name="setFieldValue('name', $event)" @update:slug="setFieldValue('slug', $event)" @check-slug="checkSlug" @generate-slug-from-name="updateSlugFromName" />

                <BehaviorStep v-if="stepIndex === 2" :behaviour-type="values.behaviour_type" :message="values.message || ''" :redirect-url="values.redirect_url || ''" @update:behaviour-type="setFieldValue('behaviour_type', $event)" @update:message="setFieldValue('message', $event)" @update:redirect-url="setFieldValue('redirect_url', $event)" />

                <ConfigureStep v-if="stepIndex === 3" :snippet="snippet" :project-id="createdProject?.id || ''" :project-slug="createdProject?.slug || ''" />
            </div>

            <div class="flex items-center mt-8 gap-4" :class="projects.length ? 'justify-between' : 'justify-end'">
                <NuxtLink v-if="stepIndex === 1 && projects.length" to="/dashboard" class="flex items-center">
                    <Button variant="outline" size="sm">Back to Dashboard</Button>
                </NuxtLink>
                <Button v-else-if="stepIndex === 2" :disabled="isSubmitting" variant="outline" size="sm" @click="handlePrevStep">
                    Previous Step
                </Button>

                <div class="flex items-center gap-3" :class="stepIndex === 3 ? 'justify-center w-full' : ''">
                    <Button v-if="stepIndex < 3" type="submit" :disabled="isSubmitting || !meta.valid">
                        {{ stepIndex === 2 ? "Create Project" : "Next Step" }}
                        <Loader2 v-if="isSubmitting" class="ml-2 h-4 w-4 animate-spin" />
                    </Button>
                </div>
            </div>
        </Stepper>
    </form>
</template>