/**
 * Firebase Data Migration Utility
 *
 * This script migrates data from in-memory state to Firebase Firestore
 * Run this once to populate your Firebase database with initial data
 */

import {
  addClass,
  logAuditAction,
  initializeSchoolClasses,
  bulkImportPupils,
  bulkImportPayments,
} from "./firestore";
import { db } from "./config";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { schoolClasses, pupils, payments, expenses } from "../data";
import type { Expense } from "../data";

export async function migrateDataToFirestore(userId: string) {
  const results = {
    classes: 0,
    pupils: 0,
    payments: 0,
    expenses: 0,
    errors: [] as string[],
  };

  console.log("🚀 Starting Firebase data migration...");

  try {
    // 1. Migrate School Classes
    console.log("📚 Migrating school classes...");
    try {
      await initializeSchoolClasses(schoolClasses);
      results.classes = schoolClasses.length;
    } catch (error) {
      results.errors.push(`Classes migration: ${error}`);
    }

    // 2. Migrate Pupils
    console.log("👨‍🎓 Migrating pupils...");
    try {
      await bulkImportPupils(pupils);
      results.pupils = pupils.length;
    } catch (error) {
      results.errors.push(`Pupils migration: ${error}`);
    }

    // 3. Migrate Payments
    console.log("💰 Migrating payments...");
    try {
      await bulkImportPayments(payments);
      results.payments = payments.length;
    } catch (error) {
      results.errors.push(`Payments migration: ${error}`);
    }

    // 4. Migrate Expenses
    console.log("📊 Migrating expenses...");
    try {
      const batch = writeBatch(db);
      expenses.forEach((expense) => {
        const docRef = collection(db, "expenses");
        batch.set(docRef as any, {
          ...expense,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      });
      await batch.commit();
      results.expenses = expenses.length;
    } catch (error) {
      results.errors.push(`Expenses migration: ${error}`);
    }

    // Log migration completion
    await logAuditAction("CREATE", "PUPIL", "migration-complete", null, {
      results,
      timestamp: new Date().toISOString(),
    });

    console.log("✅ Migration completed!");
    console.log(`   - Classes: ${results.classes}`);
    console.log(`   - Pupils: ${results.pupils}`);
    console.log(`   - Payments: ${results.payments}`);
    console.log(`   - Expenses: ${results.expenses}`);

    if (results.errors.length > 0) {
      console.log(`⚠️  Errors: ${results.errors.length}`);
      results.errors.forEach((err) => console.log(`   - ${err}`));
    }

    return results;
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

/**
 * Check if migration is needed
 * Returns true if Firestore is empty
 */
export async function isMigrationNeeded(): Promise<boolean> {
  try {
    const pupilsSnapshot = await getDocs(collection(db, "pupils"));
    return pupilsSnapshot.empty;
  } catch (error) {
    console.error("Error checking migration status:", error);
    return true;
  }
}
