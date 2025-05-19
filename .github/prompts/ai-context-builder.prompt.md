---
mode: 'agent'
tools: ['codebase', 'file']
description: 'Build context from documentation for an AI task'
---
# AI Documentation Context Builder

Help me gather relevant documentation from the brain/ directory to build context for an AI task. I'll provide a description of what I'm trying to accomplish, and you should:

1. Search the brain/docs directory for relevant documentation files
2. Review and extract the most relevant sections
3. Compile a summary of key information and patterns
4. Suggest a concise prompt that I can use with an AI tool (like GitHub Copilot) that incorporates this documentation context

The goal is to build a specialized prompt that gives the AI the specific domain knowledge it needs to help me with my task effectively.

Please ask me what technology or framework I'm working with if I don't specify.
