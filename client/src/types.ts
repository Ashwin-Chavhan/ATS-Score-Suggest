// Define the expected structure of the analysis JSONB field
export interface ScanAnalysis {
  matchingKeywords?: string[];
  missingKeywords?: string[];
  suggestions?: string[];
  summary?: string;
  [key: string]: any; // Allow other properties just in case
}
