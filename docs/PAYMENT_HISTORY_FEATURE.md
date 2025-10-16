# Payment History Feature Documentation

## Overview

The Lady Sydah Bursar system now includes a comprehensive payment history feature that tracks and displays every payment made by each student with complete details.

## Features

### 1. **Complete Payment Records**

Every payment is recorded with the following information:

- **Receipt Number**: Unique identifier for each payment (e.g., `RCP-2025-001`)
- **Date of Payment**: When the payment was made
- **Payment Type**: Fees, Lunch, Uniform, or Other
- **Payment Method**: Cash, Mobile Money, Bank Transfer, or Cheque
- **Amount**: The payment amount in UGX
- **Notes**: Any additional information about the payment
- **Received By**: Who received the payment (default: Bursar)

### 2. **Payment History Display Locations**

#### **A. Individual Pupil Detail Page** (`/dashboard/pupils/[pupilId]`)

**Basic Payment Table:**

- Shows all payments in a table format
- Columns: Receipt #, Date, Type, Method, Notes, Amount, Actions
- Each row shows payment number (#1, #2, etc.)
- "View Receipt" button for each payment
- Total payments summary in header

**Enhanced Payment History Card:**

- **Summary Statistics:**

  - Total number of payments
  - Total amount paid
  - School fees payments count
  - Other payments count

- **Interactive Timeline:**

  - Click any payment row to expand details
  - Shows running balance after each payment
  - Color-coded amounts (green for payments, red for balances)
  - Payment numbering (most recent = #1)

- **Expanded Details (when clicked):**
  - Balance before payment
  - Payment amount
  - Balance after payment
  - Received by
  - Additional notes
  - All transaction metadata

#### **B. Payments Page** (`/dashboard/payments`)

- All payments across all students
- Filter by pupil name, class, date range
- "View Receipt" option in dropdown menu

#### **C. Student Reports**

- Complete payment history table
- Payment breakdown by type
- Total paid summary
- Print-friendly format

### 3. **Payment Tracking Details**

#### **For Each Payment, The System Records:**

```typescript
{
  id: string;                    // Unique payment ID
  pupilId: string;               // Link to student
  amount: number;                // Payment amount
  date: string;                  // Payment date (YYYY-MM-DD)
  type: "Fees" | "Lunch" | ...  // Payment category
  receiptNumber: string;         // Unique receipt number
  paymentMethod?: string;        // How payment was made
  receivedBy?: string;          // Who received it
  notes?: string;               // Additional information
}
```

#### **Running Balance Calculation:**

The system automatically calculates:

- Balance before each payment
- Balance after each payment
- Total paid to date
- Outstanding balance

### 4. **Visual Indicators**

#### **Color Coding:**

- 🟢 **Green**: Payments made, positive balances
- 🔴 **Red**: Outstanding balances, amounts owed
- 🟣 **Purple**: Payment counts
- 🔵 **Blue**: Total amounts

#### **Badges:**

- **Fees**: Blue badge (default variant)
- **Lunch**: Gray badge (secondary variant)
- **Uniform**: Outlined badge
- **Other**: Red badge (destructive variant)

#### **Icons:**

- 📅 **Calendar**: Payment dates
- 💳 **Credit Card**: Payment methods
- 🧾 **Receipt**: View receipt action
- 🎁 **Gift**: Bursary indicator
- 📄 **File**: Payment history section

### 5. **Payment History Actions**

#### **Available Actions:**

1. **View Receipt**: Opens detailed receipt dialog

   - School header and branding
   - Student information
   - Payment details
   - Amount summary
   - Print and download options

2. **Expand Details**: Click any row to see:

   - Full transaction details
   - Balance progression
   - Notes and metadata

3. **Generate Report**: Create comprehensive student report
   - All payments included
   - Financial summary
   - Payment breakdown by type

### 6. **Payment Numbering System**

Payments are numbered in **reverse chronological order**:

- Most recent payment = #1
- Second most recent = #2
- And so on...

This makes it easy to reference recent payments:

> "Student's payment #1 was for school fees on Oct 15, 2025"

### 7. **Search and Filter Capabilities**

Users can filter payment history by:

- **Date Range**: Pick start and end dates
- **Class**: Filter by student class
- **Payment Type**: Fees, Lunch, Uniform, Other
- **Student Name**: Search for specific pupils

### 8. **Data Persistence**

Payment records are stored in the global application state and include:

- **Immutable Records**: Once created, payments maintain their original data
- **Edit Capability**: Authorized users can edit payment details
- **Delete Protection**: Confirmation required before deletion
- **Balance Recalculation**: Automatic balance updates on changes

### 9. **Receipt System Integration**

Every payment automatically:

1. Generates a unique receipt number
2. Records the current date and time
3. Creates a printable receipt
4. Links to student profile
5. Updates running balance

Receipt numbers follow the format:

```
RCP-[YEAR]-[SEQUENTIAL_NUMBER]
Example: RCP-2025-001, RCP-2025-002, etc.
```

### 10. **Audit Trail**

The payment history provides a complete audit trail:

- **When**: Exact date of each payment
- **What**: Payment type and amount
- **How**: Payment method used
- **Who**: Who received the payment
- **Why**: Notes explaining the payment
- **Receipt**: Unique receipt number for verification

## Usage Examples

### **Viewing a Student's Payment History:**

1. Navigate to **Pupils** page
2. Click on student name
3. Scroll to **Payment History** section
4. See basic table with all payments
5. Scroll to **Complete Payment History** card for detailed view

### **Checking a Specific Payment:**

1. Find the payment in the history table
2. Click the row to expand details
3. View balance before/after
4. Check payment method and notes
5. Click "Receipt" button to print/download

### **Tracking Payment Progress:**

1. Check **Total Paid** in summary cards
2. View **Balance After** column to see progress
3. Use color coding to identify outstanding amounts
4. Count payments to verify frequency

### **Generating Reports:**

1. Click "Generate Report" button on pupil detail page
2. Review complete payment history
3. See payment breakdown by type
4. Print or download for records

## Technical Implementation

### **Components:**

1. **PaymentHistoryCard.tsx**: Enhanced payment history with expandable rows
2. **ReceiptDialog.tsx**: Receipt generation and printing
3. **StudentReportDialog.tsx**: Comprehensive student reports
4. **PupilsDataTable.tsx**: Main pupils table with payment indicators
5. **PaymentsDataTable.tsx**: All payments table with filtering

### **Key Functions:**

- `calculateRunningBalance()`: Computes balance after each payment
- `formatCurrency()`: Formats amounts in UGX
- `format()`: Date formatting (from date-fns)
- `getPaymentStatus()`: Determines payment status (Paid/Pending/Partial)

### **State Management:**

- Global state stores all payments
- Real-time updates across components
- Automatic balance recalculation
- Persistent data structure

## Best Practices

### **For School Administrators:**

1. ✅ Always add notes for unusual payments
2. ✅ Generate receipts immediately after payment
3. ✅ Keep receipt numbers sequential
4. ✅ Verify balance after each payment
5. ✅ Generate monthly reports for audit

### **For Data Entry:**

1. ✅ Select correct payment type
2. ✅ Enter accurate payment method
3. ✅ Verify amount before saving
4. ✅ Add helpful notes when needed
5. ✅ Check student name before submission

### **For Record Keeping:**

1. ✅ Print receipts for all payments
2. ✅ Keep receipt copies on file
3. ✅ Generate term reports regularly
4. ✅ Review payment history for discrepancies
5. ✅ Backup data regularly

## Future Enhancements

Potential improvements for the payment history system:

1. **Export Capabilities**

   - Export to Excel/CSV
   - PDF batch generation
   - Email receipts automatically

2. **Advanced Analytics**

   - Payment trends over time
   - Average payment amounts
   - Payment method statistics
   - Late payment tracking

3. **Notifications**

   - Payment received confirmations
   - Outstanding balance alerts
   - Term-end summaries
   - Receipt generation notifications

4. **Integration**

   - SMS/Email receipts
   - Mobile money API integration
   - Bank reconciliation tools
   - Accounting software export

5. **Mobile App**
   - Parent portal access
   - Mobile payment history
   - Push notifications
   - Receipt downloads

---

## Summary

The payment history feature provides:

- ✅ **Complete Records**: Every payment tracked with full details
- ✅ **Easy Access**: Multiple views and entry points
- ✅ **Visual Clarity**: Color coding and badges for quick understanding
- ✅ **Audit Trail**: Comprehensive history for accountability
- ✅ **Print Ready**: Receipts and reports for documentation
- ✅ **Real-time Updates**: Instant balance calculations
- ✅ **User Friendly**: Expandable rows and intuitive interface

This system ensures that every payment is documented, traceable, and easily accessible for students, parents, and school administration.

---

_Last Updated: October 16, 2025_
_Version: 2.0_
