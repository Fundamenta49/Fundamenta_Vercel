export interface JournalAnalysis {
  emotionalScore: number;
  sentiment: string;
  wordFrequency: Record<string, number>;
  suggestions: string[];
  moodTrend: string;
}

export async function analyzeJournalEntry(content: string): Promise<JournalAnalysis> {
  try {
    const response = await fetch('/api/journal/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze journal entry');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing journal entry:', error);
    throw new Error('Failed to analyze journal entry');
  }
}

export async function analyzeMoodTrends(entries: Array<{ content: string, timestamp: string }>): Promise<{
  trends: string[],
  recommendations: string[]
}> {
  try {
    const response = await fetch('/api/journal/analyze-trends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entries })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze mood trends');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing mood trends:', error);
    throw new Error('Failed to analyze mood trends');
  }
}