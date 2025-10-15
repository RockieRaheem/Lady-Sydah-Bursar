// This file contains the initial static data for the application.
// In a real-world scenario, this data would likely come from a database or API.
// For the purpose of this prototype, it is hardcoded here.

export type SchoolClass = {
  id: string;
  name: string;
};

export type Pupil = {
  id: string;
  name: string;
  classId: string;
  guardianName: string;
  guardianContact: string;
  totalDue: number;
};

export type Payment = {
  id: string;
  pupilId: string;
  date: string;
  amount: number;
  type: 'Tuition' | 'Lunch' | 'Uniform' | 'Other';
};

export type Expense = {
  id: string;
  item: string;
  amount: number;
  date: string;
  notes: string;
};

export const schoolClasses: SchoolClass[] = [
  { id: 'baby', name: 'Baby Class' },
  { id: 'middle', name: 'Middle Class' },
  { id: 'top', name: 'Top Class' },
  { id: 'p1', name: 'P.1' },
  { id: 'p2', name: 'P.2' },
  { id: 'p3', name: 'P.3' },
  { id: 'p4', name: 'P.4' },
  { id: 'p5', name: 'P.5' },
  { id: 'p6', name: 'P.6' },
  { id: 'p7', name: 'P.7' },
];

export const pupils: Pupil[] = [
  { id: 'pupil-1', name: 'Abeni Adebayo', classId: 'p3', guardianName: 'Mr. Adebayo', guardianContact: '123-456-7890', totalDue: 200000 },
  { id: 'pupil-2', name: 'Baraka Chibuzo', classId: 'p3', guardianName: 'Ms. Chibuzo', guardianContact: '123-456-7891', totalDue: 0 },
  { id: 'pupil-3', name: 'Chidinma Diallo', classId: 'p5', guardianName: 'Mr. Diallo', guardianContact: '123-456-7892', totalDue: 200000 },
  { id: 'pupil-4', name: 'Daren Ganga', classId: 'p5', guardianName: 'Mrs. Ganga', guardianContact: '123-456-7893', totalDue: 0 },
  { id: 'pupil-5', name: 'Emeka Okoro', classId: 'p1', guardianName: 'Mr. Okoro', guardianContact: '123-456-7894', totalDue: 0 },
  { id: 'pupil-6', name: 'Fatima Bello', classId: 'p1', guardianName: 'Ms. Bello', guardianContact: '123-456-7895', totalDue: 250000 },
  { id: 'pupil-7', name: 'Gozie Obi', classId: 'p7', guardianName: 'Mr. Obi', guardianContact: '123-456-7896', totalDue: 0 },
  { id: 'pupil-8', name: 'Habiba Jalloh', classId: 'p7', guardianName: 'Mrs. Jalloh', guardianContact: '123-456-7897', totalDue: 350000 },
  { id: 'pupil-9', name: 'Ikenna Eze', classId: 'baby', guardianName: 'Mr. Eze', guardianContact: '123-456-7898', totalDue: 0 },
  { id: 'pupil-10', name: 'Jabari Toure', classId: 'middle', guardianName: 'Ms. Toure', guardianContact: '123-456-7899', totalDue: 0 },
  { id: 'pupil-11', name: 'Kunto Kinte', classId: 'p2', guardianName: 'Mr. Kinte', guardianContact: '123-456-7900', totalDue: 0 },
  { id: 'pupil-12', name: 'Lulu Mbeki', classId: 'p4', guardianName: 'Ms. Mbeki', guardianContact: '123-456-7901', totalDue: 0 },
  { id: 'pupil-13', name: 'Musa Traore', classId: 'p6', guardianName: 'Mr. Traore', guardianContact: '123-456-7902', totalDue: 325000 },
  { id: 'pupil-14', name: 'Nia Long', classId: 'top', guardianName: 'Ms. Long', guardianContact: '123-456-7903', totalDue: 0 },
  { id: 'pupil-15', name: 'Ode Tambo', classId: 'p3', guardianName: 'Mr. Tambo', guardianContact: '123-456-7904', totalDue: 250000 },
];

export const payments: Payment[] = [
  { id: 'payment-1', pupilId: 'pupil-1', date: '2024-05-01', amount: 300000, type: 'Tuition' },
  { id: 'payment-2', pupilId: 'pupil-2', date: '2024-05-02', amount: 500000, type: 'Tuition' },
  { id: 'payment-3', pupilId: 'pupil-3', date: '2024-05-03', amount: 400000, type: 'Tuition' },
  { id: 'payment-4', pupilId: 'pupil-4', date: '2024-05-04', amount: 600000, type: 'Tuition' },
  { id: 'payment-5', pupilId: 'pupil-5', date: '2024-05-05', amount: 450000, type: 'Tuition' },
  { id: 'payment-6', pupilId: 'pupil-6', date: '2024-05-06', amount: 200000, type: 'Tuition' },
  { id: 'payment-7', pupilId: 'pupil-7', date: '2024-05-07', amount: 700000, type: 'Tuition' },
  { id: 'payment-8', pupilId: 'pupil-8', date: '2024-05-08', amount: 350000, type: 'Lunch' },
  { id: 'payment-9', pupilId: 'pupil-9', date: '2024-05-09', amount: 300000, type: 'Tuition' },
  { id: 'payment-10', pupilId: 'pupil-10', date: '2024-05-10', amount: 350000, type: 'Tuition' },
  { id: 'payment-11', pupilId: 'pupil-11', date: '2024-05-11', amount: 450000, type: 'Uniform' },
  { id: 'payment-12', pupilId: 'pupil-12', date: '2024-05-12', amount: 550000, type: 'Tuition' },
  { id: 'payment-13', pupilId: 'pupil-13', date: '2024-05-13', amount: 325000, type: 'Tuition' },
  { id: 'payment-14', pupilId: 'pupil-14', date: '2024-05-14', amount: 400000, type: 'Tuition' },
  { id: 'payment-15', pupilId: 'pupil-15', date: '2024-05-15', amount: 250000, type: 'Tuition' },
];

export const expenses: Expense[] = [
  { id: 'expense-1', item: 'Chalk and Dusters', amount: 50000, date: '2024-05-01', notes: 'For all classes' },
  { id: 'expense-2', item: 'Electricity Bill', amount: 150000, date: '2024-05-03', notes: 'April bill' },
  { id: 'expense-3', item: 'Water Bill', amount: 80000, date: '2024-05-04', notes: 'April bill' },
  { id: 'expense-4', item: 'Teacher Salaries', amount: 2500000, date: '2024-05-05', notes: 'April salaries' },
  { id: 'expense-5', item: 'Cleaning Supplies', amount: 75000, date: '2024-05-10', notes: '' },
  { id: 'expense-6', item: 'Internet Subscription', amount: 120000, date: '2024-05-12', notes: 'Monthly plan' },
  { id: 'expense-7', item: 'Playground Maintenance', amount: 200000, date: '2024-05-15', notes: 'Repairing swings' },
];
