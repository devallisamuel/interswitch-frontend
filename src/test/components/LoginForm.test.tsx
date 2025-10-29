import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../../components/LoginForm";
import { useAuthContext } from "../../contexts/AuthContext";

// Mock the auth context
vi.mock("../../contexts/AuthContext", () => ({
  useAuthContext: vi.fn(),
}));

const mockLogin = vi.fn();

describe("LoginForm", () => {
  beforeEach(() => {
    (useAuthContext as any).mockReturnValue({
      login: mockLogin,
    });
    mockLogin.mockClear();
  });

  it("renders login form with all elements", () => {
    render(<LoginForm />);

    expect(screen.getByText("Health Tracker")).toBeInTheDocument();
    expect(
      screen.getByText("Please enter your username to continue")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Username:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(
      screen.getByText("Sample Credentials for Testing:")
    ).toBeInTheDocument();
  });

  it("shows error when submitting empty username", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: "Login" });
    await user.click(submitButton);

    expect(screen.getByText("Please enter a username")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("shows error when username is too short", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText("Username:");
    const submitButton = screen.getByRole("button", { name: "Login" });

    await user.type(usernameInput, "a");
    await user.click(submitButton);

    expect(
      screen.getByText("Username must be at least 2 characters long")
    ).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("calls login with valid username", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText("Username:");
    const submitButton = screen.getByRole("button", { name: "Login" });

    await user.type(usernameInput, "testuser");
    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith("testuser");
  });

  it("trims whitespace from username", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText("Username:");
    const submitButton = screen.getByRole("button", { name: "Login" });

    await user.type(usernameInput, "  testuser  ");
    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith("testuser");
  });

  it("clears error when typing valid input", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText("Username:");
    const submitButton = screen.getByRole("button", { name: "Login" });

    // First trigger error
    await user.click(submitButton);
    expect(screen.getByText("Please enter a username")).toBeInTheDocument();

    // Then type valid input and submit
    await user.type(usernameInput, "testuser");
    await user.click(submitButton);

    expect(
      screen.queryByText("Please enter a username")
    ).not.toBeInTheDocument();
  });

  it("displays sample credentials", () => {
    render(<LoginForm />);

    expect(screen.getByText("john_doe")).toBeInTheDocument();
    expect(screen.getByText("jane_smith")).toBeInTheDocument();
    expect(screen.getByText("test_user")).toBeInTheDocument();
  });
});
