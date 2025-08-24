import axios from 'axios';

export interface TextAnalysisResult {
  sentiment: {
    label: 'positive' | 'negative' | 'neutral';
    score: number;
  };
  topics: string[];
  summary: string;
  emotions: {
    joy?: number;
    sadness?: number;
    anger?: number;
    fear?: number;
    surprise?: number;
  };
  actionItems?: string[];
  insights?: string[];
}

export interface AnalysisProgress {
  stage: 'transcribing' | 'analyzing' | 'generating-insights' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
  result?: TextAnalysisResult;
  error?: string;
}

// This is a mock implementation that simulates AI analysis
// In a real implementation, you would call a proper NLP API like OpenAI
export const analyzeText = async (
  text: string,
  onProgress: (progress: AnalysisProgress) => void
): Promise<TextAnalysisResult> => {
  // Start with transcribing stage
  onProgress({
    stage: 'transcribing',
    progress: 100,
    message: 'Voice transcription complete'
  });

  // Simulate analyzing stage
  onProgress({
    stage: 'analyzing',
    progress: 0,
    message: 'Beginning text analysis'
  });
  
  // Simulate delay for analysis
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  onProgress({
    stage: 'analyzing',
    progress: 50,
    message: 'Extracting key topics and sentiment'
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate generating insights
  onProgress({
    stage: 'generating-insights',
    progress: 0,
    message: 'Beginning to generate insights'
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  onProgress({
    stage: 'generating-insights',
    progress: 50,
    message: 'Creating personalized insights'
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple sentiment analysis based on keywords
  const lowerText = text.toLowerCase();
  let sentimentScore = 0;
  
  // Very basic sentiment analysis - in a real app you would use a proper NLP API
  const positiveWords = ['happy', 'good', 'great', 'excellent', 'amazing', 'love', 'enjoy', 'excited'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'upset', 'worried'];
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) sentimentScore += 0.2;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) sentimentScore -= 0.2;
  });
  
  // Clamp between -1 and 1
  sentimentScore = Math.max(-1, Math.min(1, sentimentScore));
  
  // Extract topics (just for demo purposes)
  const words = text.split(' ')
    .filter(word => word.length > 4)
    .map(word => word.replace(/[.,?!;:()"'-]/g, '').toLowerCase());
  
  const uniqueWords = [...new Set(words)];
  const topics = uniqueWords.slice(0, 3); // Just take first few unique longer words as topics
  
  // Create a summary (first 20 words)
  const summary = text.split(' ').slice(0, 20).join(' ') + (text.split(' ').length > 20 ? '...' : '');
  
  // Mock emotions analysis
  const emotions = {
    joy: Math.max(0, Math.min(1, sentimentScore + Math.random() * 0.3)),
    sadness: Math.max(0, Math.min(1, (sentimentScore < 0 ? Math.abs(sentimentScore) : 0) + Math.random() * 0.2)),
    anger: Math.max(0, Math.min(1, (lowerText.includes('angry') || lowerText.includes('frustrat') ? 0.7 : 0) + Math.random() * 0.2)),
    fear: Math.max(0, Math.min(1, (lowerText.includes('fear') || lowerText.includes('worr') || lowerText.includes('anxious') ? 0.7 : 0) + Math.random() * 0.2)),
    surprise: Math.random() * 0.5,
  };
  
  // Generate action items and insights
  const actionItems = [
    'Reflect on your emotional state',
    'Consider journaling more regularly',
    'Try mindfulness exercises'
  ];
  
  const insights = [
    'You tend to express yourself clearly',
    `Your journal shows ${sentimentScore > 0 ? 'positive' : sentimentScore < 0 ? 'negative' : 'neutral'} sentiment`,
    'Regular reflection helps improve mental well-being'
  ];
  
  const sentimentLabel: 'positive' | 'negative' | 'neutral' = 
    sentimentScore > 0.2 ? 'positive' : sentimentScore < -0.2 ? 'negative' : 'neutral';
    
  const result: TextAnalysisResult = {
    sentiment: {
      label: sentimentLabel,
      score: sentimentScore,
    },
    topics,
    summary,
    emotions,
    actionItems,
    insights,
  };
  
  // Complete stage
  onProgress({
    stage: 'complete',
    progress: 100,
    message: 'Analysis complete',
    result
  });
  
  return result;
};
