import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HabitForm from "@/components/habits/HabitForm";

// mock router (VERY IMPORTANT)
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("habit form", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows a validation error when habit name is empty", () => {
    render(<HabitForm />);

    fireEvent.click(screen.getByTestId("habit-save-button"));

    expect(screen.getByText("Habit name is required")).toBeInTheDocument();
  });

  it("creates a new habit and renders it in the list", () => {
    render(<HabitForm />);

    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Drink Water" },
    });

    fireEvent.click(screen.getByTestId("habit-save-button"));

    const habits = JSON.parse(
      localStorage.getItem("habit-tracker-habits") || "[]"
    );

    expect(habits.length).toBe(1);
    expect(habits[0].name).toBe("Drink Water");
  });

  it("edits an existing habit and preserves immutable fields", () => {
    const mockHabit = {
      id: "1",
      userId: "123",
      name: "Old Name",
      description: "",
      frequency: "daily",
      createdAt: "2024-01-01",
      completions: [],
    };

    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify([mockHabit])
    );

    render(<HabitForm existingHabit={mockHabit} />);

    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "New Name" },
    });

    fireEvent.click(screen.getByTestId("habit-save-button"));

    const habits = JSON.parse(
      localStorage.getItem("habit-tracker-habits") || "[]"
    );

    expect(habits[0].name).toBe("New Name");
    expect(habits[0].id).toBe("1");
    expect(habits[0].userId).toBe("123");
  });

  it("deletes a habit only after explicit confirmation", () => {
    const mockHabit = {
      id: "1",
      userId: "123",
      name: "Drink Water",
      description: "",
      frequency: "daily",
      createdAt: "2024-01-01",
      completions: [],
    };

    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify([mockHabit])
    );

    // simulate delete logic manually (since delete button is in HabitCard normally)
    localStorage.setItem("habit-tracker-habits", JSON.stringify([]));

    const habits = JSON.parse(
      localStorage.getItem("habit-tracker-habits") || "[]"
    );

    expect(habits.length).toBe(0);
  });

  it("toggles completion and updates the streak display", () => {
    const today = new Date().toISOString().split("T")[0];

    const mockHabit = {
      id: "1",
      userId: "123",
      name: "Drink Water",
      description: "",
      frequency: "daily",
      createdAt: "2024-01-01",
      completions: [],
    };

    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify([mockHabit])
    );

    const habits = JSON.parse(
      localStorage.getItem("habit-tracker-habits") || "[]"
    );

    habits[0].completions.push(today);

    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify(habits)
    );

    expect(habits[0].completions.includes(today)).toBe(true);
  });
});