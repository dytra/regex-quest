"use client";

interface HighlightedRegexTextProps {
  text: string;
  regex?: RegExp | null;
  disabled?: boolean;
}

const HighlightedRegexText: React.FC<HighlightedRegexTextProps> = ({
  text,
  regex,
  disabled,
}) => {
  if (!regex || disabled) return <>{text}</>;

  // Split the text using the regex, while keeping the matches
  const matches = [...text.matchAll(regex)];

  if (matches.length === 0) return <>{text}</>;

  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, i) => {
    const start = match.index!;
    const end = start + match[0].length;

    // Add non-matching text before this match
    if (start > lastIndex) {
      result.push(
        <span key={`text-${i}`}>{text.slice(lastIndex, start)}</span>
      );
    }

    // Add highlighted match
    result.push(<mark key={`highlight-${i}`}>{text.slice(start, end)}</mark>);

    lastIndex = end;
  });

  // Add any remaining text after the last match
  if (lastIndex < text.length) {
    result.push(<span key={`text-end`}>{text.slice(lastIndex)}</span>);
  }

  return <>{result}</>;
};

export default HighlightedRegexText;
