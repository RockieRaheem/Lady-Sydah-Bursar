import type { Payment, Pupil, Expense } from "./data";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate payment data
 */
export function validatePayment(
  payment: Omit<Payment, "id">,
  pupil?: Pupil
): ValidationResult {
  const errors: ValidationError[] = [];

  // Amount validation
  if (payment.amount <= 0) {
    errors.push({
      field: "amount",
      message: "Payment amount must be positive",
    });
  }

  if (payment.amount > 10000000) {
    errors.push({
      field: "amount",
      message: "Payment amount seems unusually high",
    });
  }

  // Date validation
  const paymentDate = new Date(payment.date);
  const today = new Date();

  if (paymentDate > today) {
    errors.push({
      field: "date",
      message: "Payment date cannot be in the future",
    });
  }

  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(today.getFullYear() - 2);

  if (paymentDate < twoYearsAgo) {
    errors.push({
      field: "date",
      message: "Payment date is too far in the past",
    });
  }

  // Pupil-specific validation
  if (pupil) {
    // Check if payment exceeds balance by too much (overpayment check)
    if (payment.type === "Fees" && payment.amount > pupil.balance * 2) {
      errors.push({
        field: "amount",
        message:
          "Payment amount significantly exceeds outstanding balance. Please verify.",
      });
    }
  }

  // Receipt number validation
  if (
    payment.receiptNumber &&
    !/^RCP-\d{4}-\d{3}$/.test(payment.receiptNumber)
  ) {
    errors.push({
      field: "receiptNumber",
      message: "Invalid receipt number format. Expected: RCP-YYYY-NNN",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate pupil data
 */
export function validatePupil(pupil: Omit<Pupil, "id">): ValidationResult {
  const errors: ValidationError[] = [];

  // Name validation
  if (!pupil.name || pupil.name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "Pupil name must be at least 2 characters",
    });
  }

  if (pupil.name && pupil.name.length > 100) {
    errors.push({
      field: "name",
      message: "Pupil name is too long (max 100 characters)",
    });
  }

  // Guardian validation
  if (!pupil.guardianName || pupil.guardianName.trim().length < 2) {
    errors.push({
      field: "guardianName",
      message: "Guardian name must be at least 2 characters",
    });
  }

  // Contact validation
  if (!pupil.guardianContact || pupil.guardianContact.length < 10) {
    errors.push({
      field: "guardianContact",
      message: "Guardian contact must be at least 10 characters",
    });
  }

  // Bursary validation
  if (pupil.bursaryPercentage < 0 || pupil.bursaryPercentage > 100) {
    errors.push({
      field: "bursaryPercentage",
      message: "Bursary percentage must be between 0 and 100",
    });
  }

  if (pupil.bursaryType !== "None" && !pupil.bursaryReason) {
    errors.push({
      field: "bursaryReason",
      message: "Bursary reason is required when bursary is applied",
    });
  }

  // Balance validation
  if (pupil.totalPaid < 0) {
    errors.push({
      field: "totalPaid",
      message: "Total paid cannot be negative",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate expense data
 */
export function validateExpense(
  expense: Omit<Expense, "id">
): ValidationResult {
  const errors: ValidationError[] = [];

  // Item validation
  if (!expense.item || expense.item.trim().length < 2) {
    errors.push({
      field: "item",
      message: "Expense item must be at least 2 characters",
    });
  }

  if (expense.item && expense.item.length > 200) {
    errors.push({
      field: "item",
      message: "Expense item is too long (max 200 characters)",
    });
  }

  // Amount validation
  if (expense.amount <= 0) {
    errors.push({
      field: "amount",
      message: "Expense amount must be positive",
    });
  }

  if (expense.amount > 50000000) {
    errors.push({
      field: "amount",
      message: "Expense amount seems unusually high",
    });
  }

  // Date validation
  const expenseDate = new Date(expense.date);
  const today = new Date();

  if (expenseDate > today) {
    errors.push({
      field: "date",
      message: "Expense date cannot be in the future",
    });
  }

  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(today.getFullYear() - 3);

  if (expenseDate < threeYearsAgo) {
    errors.push({
      field: "date",
      message: "Expense date is too far in the past",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): boolean {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");

  // Should have at least 10 digits
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

/**
 * Validate receipt number format
 */
export function validateReceiptNumber(receiptNumber: string): boolean {
  return /^RCP-\d{4}-\d{3}$/.test(receiptNumber);
}

/**
 * Generate next receipt number
 */
export function generateReceiptNumber(
  lastReceiptNumber: string | null
): string {
  const year = new Date().getFullYear();

  if (!lastReceiptNumber || !lastReceiptNumber.startsWith(`RCP-${year}`)) {
    return `RCP-${year}-001`;
  }

  const match = lastReceiptNumber.match(/RCP-\d{4}-(\d{3})/);
  if (!match) {
    return `RCP-${year}-001`;
  }

  const nextNumber = parseInt(match[1]) + 1;
  return `RCP-${year}-${String(nextNumber).padStart(3, "0")}`;
}
