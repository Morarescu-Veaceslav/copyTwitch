// ms.utils.ts


export type StringValue = string | number | boolean;
export function parseMs(value: string): number {
  const regex = /^(\d+)(s|m|h|d)$/i;
  const match = value.match(regex);

  if (!match) {
    throw new Error(`Invalid duration format: "${value}". Expected formats like "30m", "1h", "7d"`);
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown time unit: "${unit}"`);
  }
}

/**
 * Optional helper: parse duration or return a default value if invalid
 */
export function parseMsOrDefault(value: string | undefined, defaultMs: number): number {
  if (!value) return defaultMs;
  try {
    return parseMs(value);
  } catch {
    return defaultMs;
  }
}