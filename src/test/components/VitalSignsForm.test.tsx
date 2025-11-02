import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VitalSignsForm from "../../components/VitalSignsForm";
import { VitalSignsProvider } from "../../contexts/VitalSignsContext";
import { AuthProvider } from "../../contexts/AuthContext";

// Mock the storage utils
vi.mock("../../utils/storage", () => ({
  storageUtils: {
    getItem: vi.fn(() => []),
    setItem: vi.fn(),
    getMedications: vi.fn(() => []),
    saveMedications: vi.fn(),
    getVitalSigns: vi.fn(() => []),
    saveVitalSigns: vi.fn(),
  },
}));

// Mock the auth context
vi.mock("../../contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAuthContext: () => ({
    user: { username: "testuser" },
    isAuthenticated: true,
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      <VitalSignsProvider>{component}</VitalSignsProvider>
    </AuthProvider>
  );
};

describe("VitalSignsForm", () => {
  it("renders form with all fields", () => {
    renderWithProviders(<VitalSignsForm />);

    expect(
      screen.getByRole("heading", { name: "Log Vital Signs" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Systolic BP (mmHg):")).toBeInTheDocument();
    expect(screen.getByLabelText("Diastolic BP (mmHg):")).toBeInTheDocument();
    expect(screen.getByLabelText("Heart Rate (BPM):")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight (lbs):")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Log Vital Signs" })
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VitalSignsForm />);

    const submitButton = screen.getByRole("button", {
      name: "Log Vital Signs",
    });
    await user.click(submitButton);

    expect(
      screen.getByText("Systolic blood pressure must be a valid number")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Diastolic blood pressure must be a valid number")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Heart rate must be a valid number")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Weight must be a valid number")
    ).toBeInTheDocument();
  });

  it("shows validation errors for out-of-range values", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VitalSignsForm />);

    const systolicInput = screen.getByLabelText("Systolic BP (mmHg):");
    const diastolicInput = screen.getByLabelText("Diastolic BP (mmHg):");
    const heartRateInput = screen.getByLabelText("Heart Rate (BPM):");
    const weightInput = screen.getByLabelText("Weight (lbs):");
    const submitButton = screen.getByRole("button", {
      name: "Log Vital Signs",
    });

    // Fill all fields - some with valid values, some with invalid ranges
    await user.type(systolicInput, "300"); // Invalid - too high
    await user.type(diastolicInput, "80"); // Valid
    await user.type(heartRateInput, "70"); // Valid
    await user.type(weightInput, "150"); // Valid

    await user.click(submitButton);

    // Check that the out-of-range error appears
    expect(
      screen.getByText("Systolic blood pressure should be between 70-250 mmHg")
    ).toBeInTheDocument();
  });

  it("shows error when systolic is not higher than diastolic", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VitalSignsForm />);

    const systolicInput = screen.getByLabelText("Systolic BP (mmHg):");
    const diastolicInput = screen.getByLabelText("Diastolic BP (mmHg):");
    const heartRateInput = screen.getByLabelText("Heart Rate (BPM):");
    const weightInput = screen.getByLabelText("Weight (lbs):");
    const submitButton = screen.getByRole("button", {
      name: "Log Vital Signs",
    });

    await user.type(systolicInput, "80");
    await user.type(diastolicInput, "120");
    await user.type(heartRateInput, "70");
    await user.type(weightInput, "150");
    await user.click(submitButton);

    expect(
      screen.getByText(
        "Systolic pressure should be higher than diastolic pressure"
      )
    ).toBeInTheDocument();
  });

  it("adds vital signs with valid data", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VitalSignsForm />);

    const systolicInput = screen.getByLabelText("Systolic BP (mmHg):");
    const diastolicInput = screen.getByLabelText("Diastolic BP (mmHg):");
    const heartRateInput = screen.getByLabelText("Heart Rate (BPM):");
    const weightInput = screen.getByLabelText("Weight (lbs):");
    const submitButton = screen.getByRole("button", {
      name: "Log Vital Signs",
    });

    await user.type(systolicInput, "120");
    await user.type(diastolicInput, "80");
    await user.type(heartRateInput, "70");
    await user.type(weightInput, "150.5");
    await user.click(submitButton);

    // Since we're using real context, we verify success by checking form reset
    expect((systolicInput as HTMLInputElement).value).toBe("");
    expect((diastolicInput as HTMLInputElement).value).toBe("");
    expect((heartRateInput as HTMLInputElement).value).toBe("");
    expect((weightInput as HTMLInputElement).value).toBe("");
  });

  it("resets form after successful submission", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VitalSignsForm />);

    const systolicInput = screen.getByLabelText(
      "Systolic BP (mmHg):"
    ) as HTMLInputElement;
    const diastolicInput = screen.getByLabelText(
      "Diastolic BP (mmHg):"
    ) as HTMLInputElement;
    const heartRateInput = screen.getByLabelText(
      "Heart Rate (BPM):"
    ) as HTMLInputElement;
    const weightInput = screen.getByLabelText(
      "Weight (lbs):"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: "Log Vital Signs",
    });

    await user.type(systolicInput, "120");
    await user.type(diastolicInput, "80");
    await user.type(heartRateInput, "70");
    await user.type(weightInput, "150");
    await user.click(submitButton);

    expect(systolicInput.value).toBe("");
    expect(diastolicInput.value).toBe("");
    expect(heartRateInput.value).toBe("");
    expect(weightInput.value).toBe("");
  });
});
