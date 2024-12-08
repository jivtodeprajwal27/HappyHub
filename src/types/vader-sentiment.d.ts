declare module 'vader-sentiment' {
    export interface SentimentIntensityAnalyzer {
      new (): SentimentIntensityAnalyzer;
      polarity_scores(text: string): { compound: number; positive: number; negative: number; neutral: number };
    }
  
    export const SentimentIntensityAnalyzer: SentimentIntensityAnalyzer;
  }
  