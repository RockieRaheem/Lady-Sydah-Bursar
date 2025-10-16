// This file contains the initial static data for the application.
// In a real-world scenario, this data would likely come from a database or API.
// For the purpose of this prototype, it is hardcoded here.

export type SchoolClass = {
  id: string;
  name: string;
  termlyFee: number; // Fixed fee per term for this class
};

export type BursaryType = "Full" | "Partial" | "None";

export type Pupil = {
  id: string;
  name: string;
  classId: string;
  guardianName: string;
  guardianContact: string;
  totalPaid: number; // Total amount paid so far
  balance: number; // Remaining balance (can be negative if overpaid)
  bursaryType: BursaryType; // Type of financial aid
  bursaryPercentage: number; // Percentage discount (0-100)
  bursaryReason?: string; // Optional reason for bursary
};

export type Payment = {
  id: string;
  pupilId: string;
  date: string;
  amount: number;
  type: "Tuition" | "Lunch" | "Uniform" | "Other";
  receiptNumber?: string; // Optional receipt tracking
};

export type Expense = {
  id: string;
  item: string;
  amount: number;
  date: string;
  notes: string;
};

export const schoolClasses: SchoolClass[] = [
  { id: "baby", name: "Baby Class", termlyFee: 200000 },
  { id: "middle", name: "Middle Class", termlyFee: 220000 },
  { id: "top", name: "Top Class", termlyFee: 240000 },
  { id: "p1", name: "P.1", termlyFee: 250000 },
  { id: "p2", name: "P.2", termlyFee: 270000 },
  { id: "p3", name: "P.3", termlyFee: 290000 },
  { id: "p4", name: "P.4", termlyFee: 310000 },
  { id: "p5", name: "P.5", termlyFee: 330000 },
  { id: "p6", name: "P.6", termlyFee: 350000 },
  { id: "p7", name: "P.7", termlyFee: 370000 },
];

export const pupils: Pupil[] = [
  // P.3 Students (Fee: 290,000)
  {
    id: "pupil-1",
    name: "Abeni Adebayo",
    classId: "p3",
    guardianName: "Mr. Adebayo",
    guardianContact: "123-456-7890",
    totalPaid: 100000,
    balance: 190000,
    bursaryType: "None",
    bursaryPercentage: 0,
  },
  {
    id: "pupil-2",
    name: "Baraka Chibuzo",
    classId: "p3",
    guardianName: "Ms. Chibuzo",
    guardianContact: "123-456-7891",
    totalPaid: 290000,
    balance: 0,
    bursaryType: "None",
    bursaryPercentage: 0,
  },
  {
    id: "pupil-15",
    name: "Ode Tambo",
    classId: "p3",
    guardianName: "Mr. Tambo",
    guardianContact: "123-456-7904",
    totalPaid: 40000,
    balance: 0,
    bursaryType: "Partial",
    bursaryPercentage: 50,
    bursaryReason: "Single parent household",
  },

  // P.5 Students (Fee: 330,000)
  {
    id: "pupil-3",
    name: "Chidinma Diallo",
    classId: "p5",
    guardianName: "Mr. Diallo",
    guardianContact: "123-456-7892",
    totalPaid: 130000,
    balance: 200000,
    bursaryType: "None",
    bursaryPercentage: 0,
  },
  {
    id: "pupil-4",
    name: "Daren Ganga",
    classId: "p5",
    guardianName: "Mrs. Ganga",
    guardianContact: "123-456-7893",
    totalPaid: 330000,
    balance: 0,
    bursaryType: "None",
    bursaryPercentage: 0,
  },

  // P.1 Students (Fee: 250,000)
  {
    id: "pupil-5",
    name: "Emeka Okoro",
    classId: "p1",
    guardianName: "Mr. Okoro",
    guardianContact: "123-456-7894",
    totalPaid: 250000,
    balance: 0,
    bursaryType: "None",
    bursaryPercentage: 0,
  },
  {
    id: "pupil-6",
    name: "Fatima Bello",
    classId: "p1",
    guardianName: "Ms. Bello",
    guardianContact: "123-456-7895",
    totalPaid: 50000,
    balance: 200000,
    bursaryType: "None",
    bursaryPercentage: 0,
  },

  // P.7 Students (Fee: 370,000)
  {
    id: "pupil-7",
    name: "Gozie Obi",
    classId: "p7",
    guardianName: "Mr. Obi",
    guardianContact: "123-456-7896",
    totalPaid: 370000,
    balance: 0,
    bursaryType: "None",
    bursaryPercentage: 0,
  },
  {
    id: "pupil-8",
    name: "Habiba Jalloh",
    classId: "p7",
    guardianName: "Mrs. Jalloh",
    guardianContact: "123-456-7897",
    totalPaid: 20000,
    balance: 0,
    bursaryType: "Full",
    bursaryPercentage: 100,
    bursaryReason: "Orphaned child - church sponsorship",
  },

  // Baby Class Students (Fee: 200,000)
  {
    id: "pupil-9",
    name: "Ikenna Eze",
    classId: "baby",
    guardianName: "Mr. Eze",
    guardianContact: "123-456-7898",
    totalPaid: 200000,
    balance: 0,
    bursaryType: "None",
    bursaryPercentage: 0,
  },

  // Middle Class Students (Fee: 220,000)
  {
    id: "pupil-10",
    name: "Jabari Toure",
    classId: "middle",
    guardianName: "Ms. Toure",
    guardianContact: "123-456-7899",
    totalPaid: 220000,
    balance: 0,
    bursaryType: "None",
    bursaryPercentage: 0,
  },

  // P.2 Students (Fee: 270,000)
  {
    id: "pupil-11",
    name: "Kunto Kinte",
    classId: "p2",
    guardianName: "Mr. Kinte",
    guardianContact: "123-456-7900",
    totalPaid: 270000,
    balance: 0,
    bursaryType: "None",
    bursaryPercentage: 0,
  },

  // P.4 Students (Fee: 310,000)
  {
    id: "pupil-12",
    name: "Lulu Mbeki",
    classId: "p4",
    guardianName: "Ms. Mbeki",
    guardianContact: "123-456-7901",
    totalPaid: 310000,
    balance: 0,
    bursaryType: "None",
    bursaryPercentage: 0,
  },

  // P.6 Students (Fee: 350,000)
  {
    id: "pupil-13",
    name: "Musa Traore",
    classId: "p6",
    guardianName: "Mr. Traore",
    guardianContact: "123-456-7902",
    totalPaid: 25000,
    balance: 87500,
    bursaryType: "Partial",
    bursaryPercentage: 75,
    bursaryReason: "Sibling discount + financial hardship",
  },

  // Top Class Students (Fee: 240,000)
  {
    id: "pupil-14",
    name: "Nia Long",
    classId: "top",
    guardianName: "Ms. Long",
    guardianContact: "123-456-7903",
    totalPaid: 240000,
    balance: 0,
    bursaryType: "None",
    bursaryPercentage: 0,
  },
];

export const payments: Payment[] = [
  {
    id: "payment-1",
    pupilId: "pupil-1",
    date: "2025-01-15",
    amount: 100000,
    type: "Tuition",
    receiptNumber: "RCP-2025-001",
  },
  {
    id: "payment-2",
    pupilId: "pupil-2",
    date: "2025-01-10",
    amount: 290000,
    type: "Tuition",
    receiptNumber: "RCP-2025-002",
  },
  {
    id: "payment-3",
    pupilId: "pupil-3",
    date: "2025-01-12",
    amount: 130000,
    type: "Tuition",
    receiptNumber: "RCP-2025-003",
  },
  {
    id: "payment-4",
    pupilId: "pupil-4",
    date: "2025-01-08",
    amount: 330000,
    type: "Tuition",
    receiptNumber: "RCP-2025-004",
  },
  {
    id: "payment-5",
    pupilId: "pupil-5",
    date: "2025-01-20",
    amount: 250000,
    type: "Tuition",
    receiptNumber: "RCP-2025-005",
  },
  {
    id: "payment-6",
    pupilId: "pupil-6",
    date: "2025-02-01",
    amount: 50000,
    type: "Tuition",
    receiptNumber: "RCP-2025-006",
  },
  {
    id: "payment-7",
    pupilId: "pupil-7",
    date: "2025-01-05",
    amount: 370000,
    type: "Tuition",
    receiptNumber: "RCP-2025-007",
  },
  {
    id: "payment-8",
    pupilId: "pupil-8",
    date: "2025-01-18",
    amount: 20000,
    type: "Other",
    receiptNumber: "RCP-2025-008",
  },
  {
    id: "payment-9",
    pupilId: "pupil-9",
    date: "2025-01-22",
    amount: 200000,
    type: "Tuition",
    receiptNumber: "RCP-2025-009",
  },
  {
    id: "payment-10",
    pupilId: "pupil-10",
    date: "2025-01-25",
    amount: 220000,
    type: "Tuition",
    receiptNumber: "RCP-2025-010",
  },
  {
    id: "payment-11",
    pupilId: "pupil-11",
    date: "2025-01-30",
    amount: 270000,
    type: "Tuition",
    receiptNumber: "RCP-2025-011",
  },
  {
    id: "payment-12",
    pupilId: "pupil-12",
    date: "2025-02-03",
    amount: 310000,
    type: "Tuition",
    receiptNumber: "RCP-2025-012",
  },
  {
    id: "payment-13",
    pupilId: "pupil-13",
    date: "2025-02-05",
    amount: 25000,
    type: "Tuition",
    receiptNumber: "RCP-2025-013",
  },
  {
    id: "payment-14",
    pupilId: "pupil-14",
    date: "2025-01-28",
    amount: 240000,
    type: "Tuition",
    receiptNumber: "RCP-2025-014",
  },
  {
    id: "payment-15",
    pupilId: "pupil-15",
    date: "2025-02-10",
    amount: 40000,
    type: "Tuition",
    receiptNumber: "RCP-2025-015",
  },
];

export const expenses: Expense[] = [
  {
    id: "expense-1",
    item: "Chalk and Dusters",
    amount: 50000,
    date: "2024-05-01",
    notes: "For all classes",
  },
  {
    id: "expense-2",
    item: "Electricity Bill",
    amount: 150000,
    date: "2024-05-03",
    notes: "April bill",
  },
  {
    id: "expense-3",
    item: "Water Bill",
    amount: 80000,
    date: "2024-05-04",
    notes: "April bill",
  },
  {
    id: "expense-4",
    item: "Teacher Salaries",
    amount: 2500000,
    date: "2024-05-05",
    notes: "April salaries",
  },
  {
    id: "expense-5",
    item: "Cleaning Supplies",
    amount: 75000,
    date: "2024-05-10",
    notes: "",
  },
  {
    id: "expense-6",
    item: "Internet Subscription",
    amount: 120000,
    date: "2024-05-12",
    notes: "Monthly plan",
  },
  {
    id: "expense-7",
    item: "Playground Maintenance",
    amount: 200000,
    date: "2024-05-15",
    notes: "Repairing swings",
  },
];

// Helper functions for fee calculations
export function calculateExpectedFee(
  pupil: Pupil,
  schoolClass: SchoolClass
): number {
  const baseFee = schoolClass.termlyFee;
  const discount = (baseFee * pupil.bursaryPercentage) / 100;
  return baseFee - discount;
}

export function getPaymentStatus(
  pupil: Pupil
): "Paid" | "Partial" | "Pending" | "Overpaid" {
  if (pupil.balance < 0) return "Overpaid";
  if (pupil.balance === 0) return "Paid";
  if (pupil.totalPaid > 0) return "Partial";
  return "Pending";
}

export function getBursaryAmount(
  pupil: Pupil,
  schoolClass: SchoolClass
): number {
  return (schoolClass.termlyFee * pupil.bursaryPercentage) / 100;
}
