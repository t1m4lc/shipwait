export default function generateSnippet(
  projectId: string,
  behaviour_type?: string,
  message?: string
) {
  const cdn = `${WAITLY_SNIPPET_CDN}@${WAITLY_SNIPPET_VERSION}/dist/main.js?projectId=${projectId}&ty=${behaviour_type}&payload=${encodeURIComponent(
    message || ""
  )}`;

  return `<script src="${cdn}"></script>`;
}
