import { SHIPWAIT_SNIPPET_CDN_URL } from "~/stores/constants";

export default function generateSnippet(
  projectId: string,
  behaviour_type?: string,
  message?: string
) {
  const cdn = `${SHIPWAIT_SNIPPET_CDN_URL}?projectId=${projectId}&ty=${behaviour_type}&payload=${encodeURIComponent(
    message || ""
  )}`;

  return `<script defer src="${cdn}"></script>`;
}
