<template>
    <div class="container max-w-4xl mx-auto py-8 px-4">
        <NuxtLink to="/dashboard">
            <Button type="button" variant="outline" class="mb-8">
                <ArrowLeft class="size-4" />
                Back to dashboard
            </Button>
        </NuxtLink>

        <h1 class="text-2xl font-bold mb-6">Test your ShipWait snippet</h1>

        <Tabs default-value="snippet" class="mb-8">
            <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger value="snippet">Use CDN Snippet</TabsTrigger>
                <TabsTrigger value="custom">Custom JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="snippet">
                <h2 class="text-xl font-semibold mb-3">1. Paste your snippet</h2>
                <div class="mb-4">
                    <textarea v-model="snippetCode"
                        class="w-full h-64 p-4 border border-gray-300 rounded-md font-mono text-sm"
                        placeholder="Paste your ShipWait snippet here or just enter your project ID..." />
                </div>
                <Button type="button" @click="loadSnippet" variant="default">
                    Apply Snippet
                </Button>
            </TabsContent>
            <TabsContent value="custom">
                <h2 class="text-xl font-semibold mb-3">1. Write your custom script</h2>
                <div class="mb-4">
                    <textarea v-model="customScript"
                        class="w-full h-64 p-4 border border-gray-300 rounded-md font-mono text-sm"
                        placeholder="Write your custom JavaScript here..." />
                </div>
                <Button type="button" @click="applyCustomScript" variant="default">
                    Apply Custom Script
                </Button>
            </TabsContent>
        </Tabs>

        <div v-if="snippetLoaded" class="mt-2 mb-4 text-green-600 font-medium">
            Script applied! You can now test the form below.
        </div>
        <div v-if="snippetError" class="mt-2 mb-4 text-red-600 font-medium">
            {{ snippetError }}
        </div>

        <h2 class="text-xl font-semibold mb-3">2. Test the form</h2>
        <div class="max-w-lg mb-8 py-6 px-10 border border-gray-200 rounded-lg bg-gray-50">
            <h3 class="text-lg pb-3 font-medium">Join my project</h3>
            <form class="space-y-4" @submit="handleSubmit">
                <div class="flex flex-col md:flex-row gap-3">
                    <input data-shipwait type="email" class="bg-background" placeholder="Enter your email" required />

                    <Button type="submit" variant="outline">
                        Join the waitlist
                    </Button>
                </div>
                <p data-shipwait-message class="min-h-3"></p>
            </form>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
            <h3 class="font-medium text-yellow-800 mb-2">How it works</h3>
            <p class="text-yellow-700 text-sm">
                1. Choose between using the ShipWait CDN snippet or writing custom JavaScript<br>
                2. Paste your snippet or write your code<br>
                3. Click "Apply" to load it into the page<br>
                4. Test the integration by submitting an email in the form<br>
                5. You can check your dashboard to confirm the signup was recorded
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import generateSnippet from '~/utils/snippet';
import { onMounted, nextTick } from 'vue';

definePageMeta({
    layout: 'blank',
    ssr: false
})

const snippetCode = ref('')
const customScript = ref(`// This is sample code - customize as needed
// No need to add preventDefault - we handle that automatically
document.querySelector('form')?.addEventListener('submit', function(e) {
  const email = document.querySelector('[data-shipwait]')?.value;
  console.log('Email captured:', email);
  
  // Display a success message
  const messageEl = document.querySelector('[data-shipwait-message]');
  if (messageEl) {
    messageEl.textContent = 'Thank you for joining the waitlist!';
  }
  
  // Here you would typically send the email to your backend
  // fetch('/api/waitlist', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email })
  // });
})`)
const snippetLoaded = ref(false)
const snippetError = ref(null)
const formElement = ref(null)

// Using a dedicated ref for the form and handling submission directly in Vue
function handleSubmit(event) {
  // Always prevent the default form submission
  event.preventDefault();
  event.stopPropagation();
  
  // The page will not reload since we've prevented the default action
  // No need to log anything here
  return false;
}

// Add our prevention handlers when the component mounts
onMounted(async () => {
  if (process.client) {
    await nextTick();
    // We'll let Vue handle the form submission instead of relying on DOM events
  }
});

// Function to load and execute the snippet from CDN
const loadSnippet = async () => {
    // Reset state
    snippetLoaded.value = false
    snippetError.value = null
    
    if (!process.client) {
        snippetError.value = 'Scripts can only be loaded in browser environment'
        return
    }

    try {
        // Remove any previously applied scripts
        cleanupPreviousScripts()
        
        let src = extractScriptSrc(snippetCode.value)
        
        if (!src) {
            // Check if the input might be just a project ID
            const projectIdMatch = snippetCode.value.trim().match(/^([a-zA-Z0-9_-]+)$/)
            if (projectIdMatch) {
                // If it's just a project ID, generate the snippet
                const projectId = projectIdMatch[1]
                const generatedSnippet = generateSnippet(projectId)
                src = extractScriptSrc(generatedSnippet)
            } else {
                snippetError.value = 'No valid script source or project ID found in the snippet'
                return
            }
        }
        
        // Create and append script element manually
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.setAttribute('data-shipwait-loaded', 'true')
        
        // Wait for script to load using a Promise
        await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = () => reject(new Error('Failed to load script'))
            document.head.appendChild(script)
        })
        
        snippetLoaded.value = true
    } catch (error) {
        snippetError.value = `Error loading snippet: ${error.message}`
    }
}

// Function to apply custom JavaScript
const applyCustomScript = () => {
    snippetLoaded.value = false
    snippetError.value = null
    
    if (!process.client) {
        snippetError.value = 'Scripts can only be executed in browser environment'
        return
    }

    try {
        // Remove any previously applied scripts
        cleanupPreviousScripts()
        
        // Create and append inline script with automatic preventDefault
        // We'll wrap the user's script with our own prevention code to ensure it never reloads
        const wrappedScript = `
        // Ensure form submission is prevented
        document.querySelectorAll('form').forEach(form => {
          form.onsubmit = function(e) { 
            e.preventDefault(); 
            e.stopPropagation();
            return false;
          };
        });
        
        // User's custom script starts here
        ${customScript.value}
        `;
        
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.textContent = wrappedScript
        script.setAttribute('data-shipwait-loaded', 'true')
        document.body.appendChild(script)
        
        snippetLoaded.value = true
    } catch (error) {
        snippetError.value = `Error applying custom script: ${error.message}`
    }
}

// Helper function to clean up previously loaded scripts
const cleanupPreviousScripts = () => {
    const existingScripts = document.querySelectorAll('script[data-shipwait-loaded]');
    existingScripts.forEach(script => script.remove());
}

function extractScriptSrc(htmlString) {
    // Check if it's a full script tag
    const scriptMatch = htmlString.match(/<script[^>]*\s+src=["']([^"']+)["'][^>]*>/i);
    
    // If it's a direct URL to the script
    const urlMatch = !scriptMatch && htmlString.trim().match(/^(https?:\/\/[^\s]+\.js(\?[^\s]*)?)/i);
    
    return scriptMatch ? scriptMatch[1] : (urlMatch ? urlMatch[1] : null);
}
</script>