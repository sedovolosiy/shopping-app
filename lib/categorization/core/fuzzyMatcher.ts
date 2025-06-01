import levenshtein from 'fast-levenshtein';

export interface SimilarityMatch {
  term: string;
  distance: number;
  similarity: number;
}

export class FuzzyMatcher {
  findSimilar(text: string, candidates: string[], maxDistance: number = 2): SimilarityMatch[] {
    const matches: SimilarityMatch[] = [];
    candidates.forEach(candidate => {
      const distance = levenshtein.get(text.toLowerCase(), candidate.toLowerCase());
      if (distance <= maxDistance) {
        const similarity = 1 - (distance / Math.max(text.length, candidate.length));
        matches.push({ term: candidate, distance, similarity });
      }
    });
    return matches.sort((a, b) => a.distance - b.distance);
  }

  findBestMatch(text: string, candidates: string[], threshold: number = 0.7): string | null {
    const matches = this.findSimilar(text, candidates, 3);
    const bestMatch = matches.find(match => match.similarity >= threshold);
    return bestMatch ? bestMatch.term : null;
  }

  correctTypos(text: string, dictionary: string[]): string {
    const words = text.split(' ');
    const correctedWords = words.map(word => {
      if (word.length < 3) return word;
      const correction = this.findBestMatch(word, dictionary, 0.8);
      return correction || word;
    });
    return correctedWords.join(' ');
  }
}
