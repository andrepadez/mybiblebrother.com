export const stripMarkdown = (text: string) => {
  return text
    .replace(/(#+)/g, '')           // Remove headers (#, ##, ###)
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold (**text** or __text__)
    .replace(/(\*|_)(.*?)\1/g, '$2')    // Remove italic (*text* or _text_)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove links [text](url)
}