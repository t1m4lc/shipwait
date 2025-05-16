import { SHIPWAIT_SNIPPET_CDN_URL } from "~/stores/constants";

export default function generateSnippet(projectId: string) {
  const cdn = `${SHIPWAIT_SNIPPET_CDN_URL}`;

  return `<script defer src="${cdn}" data-shipwait-id="${projectId}"></script>`;
}
