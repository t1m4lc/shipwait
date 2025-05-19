/**
 * Composable for generating consistent gradient colors from strings
 * Useful for creating visual identifiers for projects, users, or other entities
 */

interface GradientOptions {
  /** Type of gradient to generate */
  type?: "linear" | "radial";
  /** Direction for linear gradients (e.g. "to right", "45deg") */
  direction?: string;
  /** Saturation value for colors (0-100) */
  saturation?: number;
  /** Lightness value for colors (0-100) */
  lightness?: number;
  /** Number of colors to generate for the gradient */
  colorCount?: number;
}

export function useStringGradient() {
  /**
   * Converts a string to a consistent hue value (0-360)
   */
  const stringToHue = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Normalize to 0-360 range for hue
    return Math.abs(hash) % 360;
  };

  /**
   * Generates multiple hues based on a base hue
   */
  const generateHues = (baseHue: number, count: number): number[] => {
    const hues: number[] = [];
    // Golden ratio approximation for pleasing color distribution
    const goldenRatioConjugate = 0.618033988749895;

    let currentHue = baseHue;
    for (let i = 0; i < count; i++) {
      hues.push(currentHue % 360);
      // Use golden ratio to generate next hue
      currentHue = (currentHue + goldenRatioConjugate * 360) % 360;
    }

    return hues;
  };

  /**
   * Generates a CSS gradient string based on input string
   */
  const generateGradient = (
    inputString: string,
    options: GradientOptions = {}
  ): string => {
    const {
      type = "linear",
      direction = "to right top",
      saturation = 70,
      lightness = 60,
      colorCount = 2,
    } = options;

    // Generate base hue from string
    const baseHue = stringToHue(inputString);

    // Generate multiple hues for gradient
    const hues = generateHues(baseHue, colorCount);

    // Convert hues to CSS color values
    const colors = hues.map(
      (hue) => `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`
    );

    // Build gradient string
    if (type === "linear") {
      return `linear-gradient(${direction}, ${colors.join(", ")})`;
    } else {
      return `radial-gradient(circle, ${colors.join(", ")})`;
    }
  };

  return {
    generateGradient,
  };
}
