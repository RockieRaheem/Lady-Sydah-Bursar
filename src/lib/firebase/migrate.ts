/**
 * Firebase Data Migration Utility
 * 
 * This script migrates data from in-memory state to Firebase Firestore
 * Run this once to populate your Firebase database with initial data
 */

import {
  addPupil,
  addPayment,
  addExpense,
  addClass,
  logAuditAction,
} from './firestore';
import { schoolClasses, pupils, payments, expenses } from '../data';

export async function migrateDataToFirestore(userId: string) {
  const results = {
    classes: 0,
    pupils: 0,
    payments: 0,
    expenses: 0,
    errors: [] as string[],
  };

  console.log('🚀 Starting Firebase data migration...');

  try {
    // 1. Migrate School Classes
    console.log('📚 Migrating school classes...');
    for (const schoolClass of schoolClasses) {
      try {
        await addClass(schoolClass, userId);
        results.classes++;
      } catch (error) {
        results.errors.push(`Class ${schoolClass.name}: ${error}`);
      }
    }

    // 2. Migrate Pupils
    console.log('👨‍🎓 Migrating pupils...');
    for (const pupil of pupils) {
      try {
        await addPupil(pupil, userId);
        results.pupils++;
      } catch (error) {
        results.errors.push(`Pupil ${pupil.name}: ${error}`);
      }
    }

    // 3. Migrate Payments
    console.log('💰 Migrating payments...');
    for (const payment of payments) {
      try {
        await addPayment(payment, userId);
        results.payments++;
      } catch (error) {
        results.errors.push(`Payment ${payment.id}: ${error}`);
      }
    }

    // 4. Migrate Expenses
    console.log('📊 Migrating expenses...');
    for (const expense of expenses) {
      try {
        await addExpense(expense, userId);
        results.expenses++;
      } catch (error) {
        results.errors.push(`Expense ${expense.id}: ${error}`);
      }
    }

    // Log migration completion
    await logAuditAction(userId, 'DATA_MIGRATION', 'system', 'migration-complete', {
      results,
      timestamp: new Date().toISOString(),
    });

    console.log('✅ Migration completed!');
    console.log(`   - Classes: ${results.classes}`);
    console.log(`   - Pupils: ${results.pupils}`);
    console.log(`   - Payments: ${results.payments}`);
    console.log(`   - Expenses: ${results.expenses}`);
    
    if (results.errors.length > 0) {
      console.log(`⚠️  Errors: ${results.errors.length}`);
      results.errors.forEach(err => console.log(`   - ${err}`));
    }

    return results;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Check if migration is needed
 * Returns true if Firestore is empty
 */
export async function isMigrationNeeded(): Promise<boolean> {
  const { collection, getDocs } = await import('firebase/firestore');
  const { db } = await import('./config');
  
  try {
    const pupilsSnapshot = await getDocs(collection(db, 'pupils'));
    return pupilsSnapshot.empty;
  } catch (error) {
    console.error('Error checking migration status:', error);
    return true;
  }
}
