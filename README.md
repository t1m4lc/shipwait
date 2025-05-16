# Shipwait - Waitlist Management System

Shipwait is a simple yet powerful waitlist management system that helps you collect and manage leads for your products or services. It provides an easy way to integrate a waitlist form into your website and track signups.

## Features

- Simple integration with any website
- Customizable submission behaviors (message display, redirect, or do nothing)
- Dashboard to view and manage waitlist leads
- Project-based organization for managing multiple waitlists

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## How to Test the Snippet

To test the Shipwait snippet on a simple HTML page, create a file named `index.html` with the following code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shipwait Test Page</title>

    <!-- Add your Shipwait snippet here -->
     
  </head>
  <body>
    <div
      style="max-width: 500px; margin: 100px auto; padding: 20px; font-family: Arial, sans-serif;"
    >
      <h1>Test Your Shipwait Integration</h1>
      <p>Enter an email address below to test your waitlist integration:</p>

      <form style="margin-top: 20px;">
        <!-- Add the data-shipwait attribute to your email input -->
        <input
          data-shipwait
          type="email"
          placeholder="Enter your email"
          required
          style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;"
        />

        <!-- Optional: Add a message container -->
        <p data-shipwait-message style="min-height: 20px; color: green;"></p>

        <button
          type="submit"
          style="background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer;"
        >
          Join Waitlist
        </button>
      </form>
    </div>
  </body>
</html>
```

### How to Test the Shipwait Snippet

1. Create a project and copy the provided snippet from your [Shipwait dashboard](https://shipwait.vercel.app/dashboard/)
2. Ensure you have Node.js installed on your machine.
3. Place your index.html file (with the copied Shipwait snippet) in a dedicated folder.
4. Open a terminal in that folder and run:
5. Open the displayed URL (e.g., http://localhost:8080) in your browser.
6. Fill out the form and submit.
7. Check your [Shipwait dashboard](https://shipwait.vercel.app/dashboard/) to confirm that a new lead has appeared.
