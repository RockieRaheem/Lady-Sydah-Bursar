"use client";

import * as React from "react";
import {
  type Pupil,
  type Payment,
  type Expense,
  type SchoolClass,
  pupils as initialPupils,
  payments as initialPayments,
  expenses as initialExpenses,
  schoolClasses as initialSchoolClasses,
} from "./data";

type GlobalState = {
  pupils: Pupil[];
  setPupils: React.Dispatch<React.SetStateAction<Pupil[]>>;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  schoolClasses: SchoolClass[];
  getClassById: (classId: string) => SchoolClass | undefined;
};

const GlobalStateContext = React.createContext<GlobalState | null>(null);

export function GlobalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pupils, setPupils] = React.useState<Pupil[]>(initialPupils);
  const [payments, setPayments] = React.useState<Payment[]>(() =>
    initialPayments.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  );
  const [expenses, setExpenses] = React.useState<Expense[]>(() =>
    initialExpenses.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  );
  const [schoolClasses] = React.useState<SchoolClass[]>(initialSchoolClasses);

  const getClassById = React.useCallback(
    (classId: string) => {
      return schoolClasses.find((c) => c.id === classId);
    },
    [schoolClasses]
  );

  const value = {
    pupils,
    setPupils,
    payments,
    setPayments,
    expenses,
    setExpenses,
    schoolClasses,
    getClassById,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = React.useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
}
