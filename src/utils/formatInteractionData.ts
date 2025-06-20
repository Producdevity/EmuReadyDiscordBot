export function formatInteractionData(
  data: Record<string, unknown>,
  username: string,
  title = 'Requested by',
): string {
  return `${title}: **${username}**\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``
}
