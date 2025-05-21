/**
 * Validates HTML content for Shipwait landing pages
 * Ensures proper structure and required Shipwait attributes
 */
export function validateHtml(htmlContent: string): string[] {
  const errors: string[] = [];

  if (typeof window === "undefined" || !window.DOMParser) {
    return [];
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const parserErrors = doc.querySelectorAll("parsererror");

    if (parserErrors.length > 0) {
      errors.push("HTML is not well-formed");
    }

    const scriptTags = doc.querySelectorAll("script");
    if (scriptTags.length > 0) {
      errors.push("Script tags are not allowed");
    }

    const shipwaitInputs = doc.querySelectorAll("input[data-shipwait]");
    if (shipwaitInputs.length === 0) {
      errors.push("Missing form input with data-shipwait attribute");
    }
  } catch (error) {
    errors.push("Could not parse HTML");
  }

  return errors;
}
