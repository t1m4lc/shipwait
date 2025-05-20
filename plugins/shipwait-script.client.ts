// This plugin runs only on the client side
// The .client.ts suffix ensures Nuxt only executes it in the browser

export default defineNuxtPlugin({
  name: "shipwait-script",
  enforce: "post", // Run after all other plugins
  setup() {
    // Wait for app to be mounted (all hydration completed)
    const nuxtApp = useNuxtApp();

    nuxtApp.hook("app:mounted", () => {
      // Add the script (removed - we'll let the Vue component handle it)
      
      // Monitor for form submissions but let the component handle them
      document.addEventListener(
        "submit",
        (e) => {
          const form = e.target as HTMLFormElement;
          const hasShipwaitInput = !!form.querySelector('[data-shipwait]');
          
          if (hasShipwaitInput) {
            // Log but don't take action - let the Vue component handle it
            console.log('Shipwait form submission intercepted');
          }
        },
        { passive: true } // Make it passive to let other handlers work
      );
    });

    // Setup mutation observer to detect dynamically added forms
    if (process.client) {
      nuxtApp.hook("page:finish", () => {
        startMutationObserver();
      });
    }
  },
});

function injectShipwaitScript() {
  if (!process.client) return;

  // Remove existing script if any
  const existingScript = document.querySelector(
    'script[src*="t1m4lc/shipwait-script-dist"]'
  );
  if (existingScript) {
    existingScript.remove();
  }

  // Add script
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/gh/t1m4lc/shipwait-script-dist@latest/main.js?id=35873b4c-f7dc-4ae1-92e8-2cb56ab2bd3e";
  script.defer = false; // Load immediately for faster execution
  document.head.appendChild(script);
  
  // Add error handling
  script.onerror = () => {
    console.error('Failed to load Shipwait script, using fallback');
    injectFallbackScript();
  };
}

function injectFallbackScript() {
  if (!process.client) return;
  
  // Create inline script with our own form handling logic
  const fallbackScript = document.createElement('script');
  fallbackScript.setAttribute('data-shipwait-fallback', 'true');
  
  // This script will be injected into the page 
  // and will handle form submissions directly
  fallbackScript.textContent = `
    (function() {
      console.log("Shipwait fallback script loaded");
      
      // Find forms with data-shipwait inputs and handle their submissions
      function handleShipwaitForms() {
        const forms = document.querySelectorAll('form:not([data-shipwait-handled])');
        
        forms.forEach(form => {
          const input = form.querySelector('[data-shipwait]');
          if (!input) return;
          
          console.log("Found Shipwait form, attaching handler");
          form.setAttribute('data-shipwait-handled', 'true');
          
          const projectId = '35873b4c-f7dc-4ae1-92e8-2cb56ab2bd3e';
          const messageEl = form.querySelector('[data-shipwait-message]');
          const submitButton = form.querySelector('button[type="submit"]');
          const originalButtonText = submitButton ? submitButton.textContent : 'Submit';
          
          form.addEventListener('submit', async function(e) {
            // Always prevent default to avoid page reload
            e.preventDefault();
            console.log("Form submission intercepted by fallback");
            
            const email = input.value.trim();
            if (!email) {
              showMessage('Please enter your email.');
              return;
            }
            
            setLoading(true);
            
            try {
              // Submit the form data
              const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, projectId })
              });
              
              if (!response.ok) {
                throw new Error('Failed to submit form');
              }
              
              // Show success message
              showMessage('Thank you for subscribing!');
              input.value = '';
            } catch (err) {
              showMessage(err.message || 'An error occurred');
            } finally {
              setLoading(false);
            }
          });
          
          function showMessage(msg) {
            if (messageEl) {
              messageEl.textContent = msg;
            } else {
              alert(msg);
            }
          }
          
          function setLoading(isLoading) {
            input.disabled = isLoading;
            
            if (submitButton) {
              submitButton.disabled = isLoading;
              submitButton.textContent = isLoading ? originalButtonText + '...' : originalButtonText;
            }
          }
        });
      }
      
      // Handle forms now and whenever DOM changes
      handleShipwaitForms();
      
      // Watch for dynamically added forms
      const observer = new MutationObserver(() => {
        handleShipwaitForms();
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    })();
  `;
  
  // Remove any existing fallback script
  const existingFallback = document.querySelector('script[data-shipwait-fallback]');
  if (existingFallback) {
    existingFallback.remove();
  }
  
  document.head.appendChild(fallbackScript);
}

function startMutationObserver() {
  if (!process.client) return;

  // Create a mutation observer to watch for dynamically added forms
  const observer = new MutationObserver((mutations) => {
    let needsScriptRefresh = false;

    // Check if any forms were added
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        const forms = document.querySelectorAll(
          "form:not([data-shipwait-observed])"
        );
        if (forms.length > 0) {
          needsScriptRefresh = true;
          // Mark forms as observed
          forms.forEach((form) =>
            form.setAttribute("data-shipwait-observed", "true")
          );
        }
      }
    });

    if (needsScriptRefresh) {
      injectShipwaitScript();
    }
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
