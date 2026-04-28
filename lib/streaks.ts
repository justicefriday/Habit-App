export function calculateCurrentStreak(
  completions: string[],
  today?: string
): number {
  if (completions.length === 0) return 0;

  const uniqueDates = Array.from(new Set(completions)).sort();

  const currentDay =
    today || new Date().toISOString().split("T")[0];

  if (!uniqueDates.includes(currentDay)) return 0;

  let streak = 0;
  let current = new Date(currentDay);

  while (true) {
    const dateStr = current.toISOString().split("T")[0];

    if (uniqueDates.includes(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}