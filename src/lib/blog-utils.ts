interface ContentNode {
  type?: string;
  text?: string;
  content?: ContentNode[];
}

export function extractTextFromContent(
  content: ContentNode | null | undefined,
  maxLength: number = 150
): string {
  if (!content) return "";

  const extractText = (node: ContentNode): string => {
    if (node.type === "text" && node.text) {
      return node.text;
    }
    if (node.content) {
      return node.content.map(extractText).join(" ");
    }
    return "";
  };

  const text = extractText(content).trim();
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + "...";
}
