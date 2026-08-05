/** Structured tutor-agent decision — domain service (parse LLM JSON contract). */

export type TutorAgentAction =
  | 'answer'
  | 'refuse_off_subject'
  | 'refuse_role';

export type TutorAgentDecision = {
  action: TutorAgentAction;
  reply: string;
};

/** Parse the structured tutor agent JSON (with light fence/raw fallbacks). */
export function parseTutorAgentDecision(
  raw: string,
): TutorAgentDecision | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const candidates = [trimmed];
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) candidates.unshift(fenced[1].trim());
  const embedded = trimmed.match(/\{[\s\S]*\}/);
  if (embedded?.[0]) candidates.unshift(embedded[0]);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as Partial<TutorAgentDecision>;
      if (
        parsed &&
        (parsed.action === 'answer' ||
          parsed.action === 'refuse_off_subject' ||
          parsed.action === 'refuse_role') &&
        typeof parsed.reply === 'string' &&
        parsed.reply.trim().length > 0
      ) {
        return {
          action: parsed.action,
          reply: parsed.reply.trim(),
        };
      }
    } catch {
      // try next candidate
    }
  }

  return null;
}
