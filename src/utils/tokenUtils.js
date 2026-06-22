// Count existing tokens for a specific character
export const countTokens = (tokens, characterId) => {
  return tokens.filter((t) => t.name.toLowerCase() === characterId.toLowerCase()).length;
};

// Check if max tokens reached
export const isMaxTokensReached = (tokens, character) => {
  const count = countTokens(tokens, character.id || character.name);
  const max = character.maxTokens ?? Infinity;
  return count >= max;
};
