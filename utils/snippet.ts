export default function generateSnippet(
  projectId: string,
  behaviour_type?: string,
  message?: string
) {
  const cdn = `${SHIPWAIT_SNIPPET_CDN}@${SHIPWAIT_SNIPPET_VERSION}/dist/main.js?projectId=${projectId}&ty=${behaviour_type}&payload=${encodeURIComponent(
    message || ""
  )}`;

  return `<script defer src="${cdn}"></script>`;
}
