type Scale = Record<string | number, string>;
export declare const colors: {
  blue: Scale;
  cyan: Scale;
  accent: string;
  ink: Scale;
  surface: Scale;
  line: Scale;
  danger: Scale;
};
export declare const glass: { hero: string };
export declare const radii: { hero: string; card: string; pill: string };
export declare const shadows: { card: string };
export declare const gradients: {
  hero: string;
  heroSoft: string;
  pillBlue: string;
  pillNavy: string;
  pillDark: string;
  textHero: string;
};
export declare const CONTRAST_RULES: [fg: string, bg: string, min: number, usage: string][];
export declare const GLASS_RULES: { glass: string; stops: string[] };
export declare function resolveColor(path: string): string;
