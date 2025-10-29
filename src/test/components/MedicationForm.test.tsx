import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MedicationForm from "../../components/MedicationForm";
import { useMedications } from "../../hooks/useMedications";

// Mock the medications hook
vi.mock("../../hooks/useMedications", () => ({
  useMedications: vi.fn(),
}));

const mockAddMedication = vi.fn();

describe("MedicationForm", () => {
  beforeEach(() => {
    (useMedications as any).mockReturnValue({
      addMedication: mockAddMedication,
    });
    mockAddMedication.mockClear();
  });

  it("renders form with all fields", () => {
    render(<MedicationForm />);

    expect(screen.getByText("Add New Medication")).toBeInTheDocument();
    expect(screen.getByLabelText("Medication Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Dosage:")).toBeInTheDocument();
    expect(screen.getByLabelText("Frequency:")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Medication" })
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<MedicationForm />);

    const submitButton = screen.getByRole("button", { name: "Add Medication" });
    await user.click(submitButton);

    expect(screen.getByText("Medication name is required")).toBeInTheDocument();
    expect(screen.getByText("Dosage is required")).toBeInTheDocument();
    expect(screen.getByText("Frequency is required")).toBeInTheDocument();
    expect(mockAddMedication).not.toHaveBeenCalled();
  });

  it("adds medication with valid data", async () => {
    const user = userEvent.setup();
    render(<MedicationForm />);

    const nameInput = screen.getByLabelText("Medication Name:");
    const dosageInput = screen.getByLabelText("Dosage:");
    const frequencyInput = screen.getByLabelText("Frequency:");
    const submitButton = screen.getByRole("button", { name: "Add Medication" });

    await user.type(nameInput, "Lisinopril");
    await user.type(dosageInput, "20mg");
    await user.type(frequencyInput, "Once daily");
    await user.click(submitButton);

    expect(mockAddMedication).toHaveBeenCalledWith({
      name: "Lisinopril",
      dosage: "20mg",
      frequency: "Once daily",
    });
  });

  it("resets form after successful submission", async () => {
    const user = userEvent.setup();
    render(<MedicationForm />);

    const nameInput = screen.getByLabelText(
      "Medication Name:"
    ) as HTMLInputElement;
    const dosageInput = screen.getByLabelText("Dosage:") as HTMLInputElement;
    const frequencyInput = screen.getByLabelText(
      "Frequency:"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: "Add Medication" });

    await user.type(nameInput, "Lisinopril");
    await user.type(dosageInput, "20mg");
    await user.type(frequencyInput, "Once daily");
    await user.click(submitButton);

    expect(nameInput.value).toBe("");
    expect(dosageInput.value).toBe("");
    expect(frequencyInput.value).toBe("");
  });

  it("trims whitespace from inputs", async () => {
    const user = userEvent.setup();
    render(<MedicationForm />);

    const nameInput = screen.getByLabelText("Medication Name:");
    const dosageInput = screen.getByLabelText("Dosage:");
    const frequencyInput = screen.getByLabelText("Frequency:");
    const submitButton = screen.getByRole("button", { name: "Add Medication" });

    await user.type(nameInput, "  Lisinopril  ");
    await user.type(dosageInput, "  20mg  ");
    await user.type(frequencyInput, "  Once daily  ");
    await user.click(submitButton);

    expect(mockAddMedication).toHaveBeenCalledWith({
      name: "Lisinopril",
      dosage: "20mg",
      frequency: "Once daily",
    });
  });
});
