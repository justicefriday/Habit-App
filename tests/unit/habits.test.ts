import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "@/lib/habits";

const mockHabit = {
  id: "1",
  userId: "u1",
  name: "Test",
  description: "",
  frequency: "daily" as const,
  createdAt: "",
  completions: [],
};

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const result = toggleHabitCompletion(mockHabit, "2024-01-01");
    expect(result.completions).toContain("2024-01-01");
  });

  it("removes a completion date when the date already exists", () => {
    const habit = {
      ...mockHabit,
      completions: ["2024-01-01"],
    };

    const result = toggleHabitCompletion(habit, "2024-01-01");
    expect(result.completions).not.toContain("2024-01-01");
  });

  it("does not mutate the original habit object", () => {
    const habit = { ...mockHabit };
    toggleHabitCompletion(habit, "2024-01-01");

    expect(habit.completions.length).toBe(0);
  });

  it("does not return duplicate completion dates", () => {
    const habit = {
      ...mockHabit,
      completions: ["2024-01-01"],
    };

    const result = toggleHabitCompletion(habit, "2024-01-01");
    expect(result.completions).toEqual([]);
  });
});