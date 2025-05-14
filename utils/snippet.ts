export default function generateSnippet(projectId: string) {
  return `<script
        src="https://cdn.example.com/waitly.js"
        data-project-id="${projectId}">
    </script>`;
}
