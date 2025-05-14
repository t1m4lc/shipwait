export default function generateSnippet(projectId: string, token: string) {
  return `<script
        src="https://cdn.example.com/waitly.js"
        data-project-id="${projectId}"
        data-token="${token}">
    </script>`;
}
