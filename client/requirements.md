## Packages
framer-motion | Essential for high-quality, fluid page transitions and interactive animations that make the UI feel premium
clsx | Utility for constructing `className` conditionally
tailwind-merge | Utility to merge tailwind classes safely

## Notes
- The `analysis` field in the `scans` table is a JSONB column. The frontend assumes it roughly matches this shape: `{ matchingKeywords: string[], missingKeywords: string[], suggestions: string[] }`. We will handle missing properties defensively.
- Using Sora for display text and Manrope for body text to give a clean, modern, startup aesthetic.
