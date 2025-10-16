import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  onSnapshot,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";
import type { Pupil, Payment, Expense, SchoolClass } from "@/lib/data";

// Collection names
const COLLECTIONS = {
  PUPILS: "pupils",
  PAYMENTS: "payments",
  EXPENSES: "expenses",
  CLASSES: "schoolClasses",
  AUDIT_LOGS: "auditLogs",
};

// ============================================
// PUPILS OPERATIONS
// ============================================

export async function addPupil(pupil: Omit<Pupil, "id">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PUPILS), {
      ...pupil,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    await logAuditAction("CREATE", "PUPIL", docRef.id, null, pupil);

    return docRef.id;
  } catch (error) {
    console.error("Error adding pupil:", error);
    throw new Error("Failed to add pupil");
  }
}

export async function getPupils(classId?: string): Promise<Pupil[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy("name", "asc")];

    if (classId && classId !== "all") {
      constraints.unshift(where("classId", "==", classId));
    }

    const q = query(collection(db, COLLECTIONS.PUPILS), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Pupil[];
  } catch (error) {
    console.error("Error getting pupils:", error);
    throw new Error("Failed to fetch pupils");
  }
}

export async function getPupilById(id: string): Promise<Pupil | null> {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.PUPILS, id));

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Pupil;
    }

    return null;
  } catch (error) {
    console.error("Error getting pupil:", error);
    throw new Error("Failed to fetch pupil");
  }
}

export async function updatePupil(
  id: string,
  data: Partial<Pupil>
): Promise<void> {
  try {
    const pupilRef = doc(db, COLLECTIONS.PUPILS, id);
    const oldData = await getDoc(pupilRef);

    await updateDoc(pupilRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });

    await logAuditAction("UPDATE", "PUPIL", id, oldData.data(), data);
  } catch (error) {
    console.error("Error updating pupil:", error);
    throw new Error("Failed to update pupil");
  }
}

export async function deletePupil(id: string): Promise<void> {
  try {
    const pupilRef = doc(db, COLLECTIONS.PUPILS, id);
    const oldData = await getDoc(pupilRef);

    await deleteDoc(pupilRef);

    await logAuditAction("DELETE", "PUPIL", id, oldData.data(), null);
  } catch (error) {
    console.error("Error deleting pupil:", error);
    throw new Error("Failed to delete pupil");
  }
}

// ============================================
// PAYMENTS OPERATIONS
// ============================================

export async function addPayment(
  payment: Omit<Payment, "id">
): Promise<string> {
  try {
    const batch = writeBatch(db);

    // Add payment
    const paymentRef = doc(collection(db, COLLECTIONS.PAYMENTS));
    batch.set(paymentRef, {
      ...payment,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Update pupil balance
    const pupilRef = doc(db, COLLECTIONS.PUPILS, payment.pupilId);
    const pupilSnap = await getDoc(pupilRef);

    if (pupilSnap.exists()) {
      const pupilData = pupilSnap.data() as Pupil;
      batch.update(pupilRef, {
        totalPaid: pupilData.totalPaid + payment.amount,
        balance: pupilData.balance - payment.amount,
        updatedAt: Timestamp.now(),
      });
    }

    await batch.commit();

    await logAuditAction("CREATE", "PAYMENT", paymentRef.id, null, payment);

    return paymentRef.id;
  } catch (error) {
    console.error("Error adding payment:", error);
    throw new Error("Failed to add payment");
  }
}

export async function getPayments(pupilId?: string): Promise<Payment[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy("date", "desc")];

    if (pupilId) {
      constraints.unshift(where("pupilId", "==", pupilId));
    }

    const q = query(collection(db, COLLECTIONS.PAYMENTS), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Payment[];
  } catch (error) {
    console.error("Error getting payments:", error);
    throw new Error("Failed to fetch payments");
  }
}

export async function updatePayment(
  id: string,
  data: Partial<Payment>
): Promise<void> {
  try {
    const paymentRef = doc(db, COLLECTIONS.PAYMENTS, id);
    const oldData = await getDoc(paymentRef);

    await updateDoc(paymentRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });

    await logAuditAction("UPDATE", "PAYMENT", id, oldData.data(), data);
  } catch (error) {
    console.error("Error updating payment:", error);
    throw new Error("Failed to update payment");
  }
}

export async function deletePayment(id: string): Promise<void> {
  try {
    const paymentRef = doc(db, COLLECTIONS.PAYMENTS, id);
    const oldData = await getDoc(paymentRef);
    const paymentData = oldData.data() as Payment;

    const batch = writeBatch(db);

    // Delete payment
    batch.delete(paymentRef);

    // Update pupil balance
    const pupilRef = doc(db, COLLECTIONS.PUPILS, paymentData.pupilId);
    const pupilSnap = await getDoc(pupilRef);

    if (pupilSnap.exists()) {
      const pupilData = pupilSnap.data() as Pupil;
      batch.update(pupilRef, {
        totalPaid: pupilData.totalPaid - paymentData.amount,
        balance: pupilData.balance + paymentData.amount,
        updatedAt: Timestamp.now(),
      });
    }

    await batch.commit();

    await logAuditAction("DELETE", "PAYMENT", id, oldData.data(), null);
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw new Error("Failed to delete payment");
  }
}

// ============================================
// EXPENSES OPERATIONS
// ============================================

export async function addExpense(
  expense: Omit<Expense, "id">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.EXPENSES), {
      ...expense,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    await logAuditAction("CREATE", "EXPENSE", docRef.id, null, expense);

    return docRef.id;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw new Error("Failed to add expense");
  }
}

export async function getExpenses(): Promise<Expense[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.EXPENSES),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Expense[];
  } catch (error) {
    console.error("Error getting expenses:", error);
    throw new Error("Failed to fetch expenses");
  }
}

export async function updateExpense(
  id: string,
  data: Partial<Expense>
): Promise<void> {
  try {
    const expenseRef = doc(db, COLLECTIONS.EXPENSES, id);
    const oldData = await getDoc(expenseRef);

    await updateDoc(expenseRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });

    await logAuditAction("UPDATE", "EXPENSE", id, oldData.data(), data);
  } catch (error) {
    console.error("Error updating expense:", error);
    throw new Error("Failed to update expense");
  }
}

export async function deleteExpense(id: string): Promise<void> {
  try {
    const expenseRef = doc(db, COLLECTIONS.EXPENSES, id);
    const oldData = await getDoc(expenseRef);

    await deleteDoc(expenseRef);

    await logAuditAction("DELETE", "EXPENSE", id, oldData.data(), null);
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw new Error("Failed to delete expense");
  }
}

// ============================================
// SCHOOL CLASSES OPERATIONS
// ============================================

export async function getSchoolClasses(): Promise<SchoolClass[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.CLASSES));

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SchoolClass[];
  } catch (error) {
    console.error("Error getting school classes:", error);
    throw new Error("Failed to fetch school classes");
  }
}

export async function initializeSchoolClasses(
  classes: SchoolClass[]
): Promise<void> {
  try {
    const batch = writeBatch(db);

    classes.forEach((cls) => {
      const docRef = doc(db, COLLECTIONS.CLASSES, cls.id);
      batch.set(docRef, cls);
    });

    await batch.commit();
  } catch (error) {
    console.error("Error initializing school classes:", error);
    throw new Error("Failed to initialize school classes");
  }
}

// ============================================
// AUDIT LOG
// ============================================

export async function logAuditAction(
  action: "CREATE" | "UPDATE" | "DELETE",
  resource: "PUPIL" | "PAYMENT" | "EXPENSE",
  resourceId: string,
  oldValue: any,
  newValue: any
): Promise<void> {
  try {
    // Get current user from Firebase Auth
    const { auth } = await import("./config");
    const user = auth?.currentUser;

    if (!user) return;

    await addDoc(collection(db, COLLECTIONS.AUDIT_LOGS), {
      userId: user.uid,
      userEmail: user.email,
      action,
      resource,
      resourceId,
      oldValue,
      newValue,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error logging audit action:", error);
    // Don't throw error - audit log failure shouldn't break the main operation
  }
}

// Helper function for addClass compatibility
export async function addClass(schoolClass: SchoolClass): Promise<void> {
  try {
    await initializeSchoolClasses([schoolClass]);
  } catch (error) {
    console.error("Error adding class:", error);
    throw new Error("Failed to add school class");
  }
}

// ============================================
// REAL-TIME LISTENERS
// ============================================

export function subscribeToPupils(
  callback: (pupils: Pupil[]) => void,
  classId?: string
): () => void {
  const constraints: QueryConstraint[] = [orderBy("name", "asc")];

  if (classId && classId !== "all") {
    constraints.unshift(where("classId", "==", classId));
  }

  const q = query(collection(db, COLLECTIONS.PUPILS), ...constraints);

  return onSnapshot(q, (snapshot) => {
    const pupils = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Pupil[];
    callback(pupils);
  });
}

export function subscribeToPayments(
  callback: (payments: Payment[]) => void,
  pupilId?: string
): () => void {
  const constraints: QueryConstraint[] = [orderBy("date", "desc")];

  if (pupilId) {
    constraints.unshift(where("pupilId", "==", pupilId));
  }

  const q = query(collection(db, COLLECTIONS.PAYMENTS), ...constraints);

  return onSnapshot(q, (snapshot) => {
    const payments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Payment[];
    callback(payments);
  });
}

export function subscribeToExpenses(
  callback: (expenses: Expense[]) => void
): () => void {
  const q = query(
    collection(db, COLLECTIONS.EXPENSES),
    orderBy("date", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Expense[];
    callback(expenses);
  });
}

// ============================================
// BATCH OPERATIONS
// ============================================

export async function bulkImportPupils(
  pupils: Omit<Pupil, "id">[]
): Promise<string[]> {
  try {
    const ids: string[] = [];
    const batch = writeBatch(db);

    pupils.forEach((pupil) => {
      const docRef = doc(collection(db, COLLECTIONS.PUPILS));
      batch.set(docRef, {
        ...pupil,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      ids.push(docRef.id);
    });

    await batch.commit();

    return ids;
  } catch (error) {
    console.error("Error bulk importing pupils:", error);
    throw new Error("Failed to import pupils");
  }
}

export async function bulkImportPayments(
  payments: Omit<Payment, "id">[]
): Promise<string[]> {
  try {
    const ids: string[] = [];

    // Process in batches of 500 (Firestore limit)
    for (let i = 0; i < payments.length; i += 500) {
      const batch = writeBatch(db);
      const batchPayments = payments.slice(i, i + 500);

      batchPayments.forEach((payment) => {
        const docRef = doc(collection(db, COLLECTIONS.PAYMENTS));
        batch.set(docRef, {
          ...payment,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        ids.push(docRef.id);
      });

      await batch.commit();
    }

    return ids;
  } catch (error) {
    console.error("Error bulk importing payments:", error);
    throw new Error("Failed to import payments");
  }
}

// ============================================
// DATA MIGRATION / BACKUP
// ============================================

export async function backupAllData() {
  try {
    const [pupils, payments, expenses, classes] = await Promise.all([
      getPupils(),
      getPayments(),
      getExpenses(),
      getSchoolClasses(),
    ]);

    return {
      pupils,
      payments,
      expenses,
      schoolClasses: classes,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error backing up data:", error);
    throw new Error("Failed to backup data");
  }
}

export async function restoreFromBackup(backup: {
  pupils: Pupil[];
  payments: Payment[];
  expenses: Expense[];
  schoolClasses: SchoolClass[];
}) {
  try {
    // This should be used carefully - it will overwrite existing data
    await initializeSchoolClasses(backup.schoolClasses);
    await bulkImportPupils(backup.pupils);
    await bulkImportPayments(backup.payments);

    // Import expenses
    const expenseBatch = writeBatch(db);
    backup.expenses.forEach((expense) => {
      const docRef = doc(collection(db, COLLECTIONS.EXPENSES));
      expenseBatch.set(docRef, {
        ...expense,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    });
    await expenseBatch.commit();
  } catch (error) {
    console.error("Error restoring from backup:", error);
    throw new Error("Failed to restore from backup");
  }
}
