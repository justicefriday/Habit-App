import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";
import { vi } from "vitest";


// mock NExt ROuther
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));
// clear storage before each test
beforeEach(() => {
  localStorage.clear();
});

describe("auth flow", () => {
  it("submits the signup form and creates a session", () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    const session = JSON.parse(
      localStorage.getItem("habit-tracker-session") || "null"
    );

    expect(session).not.toBeNull();
    expect(session.email).toBe("test@example.com");
  });

  it("shows an error for duplicate signup email", () => {
    const existingUser = [
      {
        id: "1",
        email: "test@example.com",
        password: "password123",
        createdAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem("habit-tracker-users", JSON.stringify(existingUser));

    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    expect(screen.getByText("User already exists")).toBeInTheDocument();
  });

  it("submits the login form and stores the active session", () => {
    const users = [
      {
        id: "1",
        email: "test@example.com",
        password: "password123",
        createdAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem("habit-tracker-users", JSON.stringify(users));

    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("auth-login-submit"));

    const session = JSON.parse(
      localStorage.getItem("habit-tracker-session") || "null"
    );

    expect(session).not.toBeNull();
    expect(session.email).toBe("test@example.com");
  });

  it("shows an error for invalid login credentials", () => {
    const users = [
      {
        id: "1",
        email: "test@example.com",
        password: "password123",
        createdAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem("habit-tracker-users", JSON.stringify(users));

    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "wrong@example.com" },
    });

    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByTestId("auth-login-submit"));

    expect(
      screen.getByText("Invalid email or password")
    ).toBeInTheDocument();
  });
});