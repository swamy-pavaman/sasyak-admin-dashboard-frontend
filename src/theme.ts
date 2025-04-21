// Agriculture theme configuration with green as the primary color

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme colors - Agriculture-focused with green as primary
export const themeColors = {
  primary: {
    DEFAULT: "rgb(34, 197, 94)", // Green-500
    light: "rgb(187, 247, 208)", // Green-200
    dark: "rgb(22, 163, 74)", // Green-600
    extraDark: "rgb(21, 128, 61)", // Green-700
    foreground: "rgb(255, 255, 255)", // White
  },
  secondary: {
    DEFAULT: "rgb(168, 162, 158)", // Neutral/Earth tone
    foreground: "rgb(255, 255, 255)", // White
  },
  accent: {
    DEFAULT: "rgb(234, 179, 8)", // Amber-500 (wheat/grain color)
    foreground: "rgb(255, 255, 255)", // White
  },
  destructive: {
    DEFAULT: "rgb(239, 68, 68)", // Red-500
    foreground: "rgb(255, 255, 255)", // White
  },
  success: {
    DEFAULT: "rgb(34, 197, 94)", // Green-500
    foreground: "rgb(255, 255, 255)", // White
  },
  warning: {
    DEFAULT: "rgb(234, 179, 8)", // Amber-500
    foreground: "rgb(255, 255, 255)", // White
  },
  info: {
    DEFAULT: "rgb(59, 130, 246)", // Blue-500
    foreground: "rgb(255, 255, 255)", // White
  },
};

// Apply to tailwind.config.js to override the theme