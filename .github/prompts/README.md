# Prompts Folder

This folder contains prompt files for customizing GitHub Copilot's behavior in VS Code. Prompt files allow you to create reusable prompts that can be referenced in chat and shared with others.

## Prompt File Structure

A prompt file is a Markdown file with the `.prompt.md` suffix, containing:
- Optional metadata header (Front Matter syntax)
- The prompt content in the body

### Available Front Matter Options

#### Mode Options
The `mode` property specifies how Copilot should process your prompt:
- `agent` (default): Enables Copilot to use multiple tools to plan and implement changes
- `edit`: For making code edits across one or more files
- `ask`: For general question-answering without making changes to files

#### Tools Options
The `tools` property is an array of tools available in agent mode:
- `codebase`: Search and understand code in the current workspace
- `terminalLastCommand`: Access the last command run in the terminal
- `githubRepo`: Search for code in GitHub repositories
- `terminalSelection`: Use selected content from the terminal
- `fetch`: Fetch content from web pages
- `file`: Access file system operations
- `terminal`: Run commands in the terminal
- `createFile`: Create new files
- `editFile`: Modify existing files
- `simpleBrowser`: Preview websites in the Simple Browser

Example syntax:
```markdown
---
mode: 'agent'
tools: ['codebase', 'terminal', 'githubRepo']
description: 'A short description of what this prompt does'
---
```

## Best Practice Example

**Example: `react-form.prompt.md`**
```markdown
---
mode: 'agent'
tools: ['githubRepo', 'codebase']
description: 'Generate a new React form component'
---
Your goal is to generate a new React form component.

Requirements for the form:
* Use `react-hook-form` for form state management
* Always define TypeScript types for your form data
* Prefer *uncontrolled* components using register
* Use `yup` for validation
* Create reusable validation schemas in separate files

Ask for the form name and fields if not provided.
```

## How to Use Prompt Files

1. Create prompt files using Command Palette (`⇧⌘P`) → `Chat: New Prompt File`
2. Run the prompt in chat by:
   - Typing `/` followed by the prompt name in the chat input field (e.g., `/react-form`)
   - Running `Chat: Run Prompt` from the Command Palette and selecting your prompt file
   - Opening the prompt file in the editor and clicking the play button in the editor title area

## Additional Features

- Reference variables with `${variableName}` syntax
- Reference other prompt or instruction files using Markdown links
- Configure the chat mode and available tools in the front matter

See the [VS Code Copilot Customization Guide](https://code.visualstudio.com/docs/copilot/copilot-customization#_prompt-files-experimental) for more details.
