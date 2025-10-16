# Bursary & Fee Management System

## Overview

The Lady Sydah Bursar system now includes a comprehensive fee structure with bursary (financial aid) support. Each class has a fixed termly fee, and students can receive full or partial bursaries based on their circumstances.

## Class Fee Structure

| Class        | Termly Fee (UGX) |
| ------------ | ---------------- |
| Baby Class   | 200,000          |
| Middle Class | 220,000          |
| Top Class    | 240,000          |
| P.1          | 250,000          |
| P.2          | 270,000          |
| P.3          | 290,000          |
| P.4          | 310,000          |
| P.5          | 330,000          |
| P.6          | 350,000          |
| P.7          | 370,000          |

## Pupil Payment Tracking

### New Fields

Each pupil now has:

- **Total Paid**: Sum of all payments made
- **Balance**: Remaining amount owed (Expected Fee - Total Paid)
- **Bursary Type**: None, Partial, or Full
- **Bursary Percentage**: 0-100% discount
- **Bursary Reason**: Optional explanation for financial aid

### Payment Status

The system automatically calculates payment status:

- **Paid** ✅: Balance = 0
- **Partial** ⚠️: Some payment made, balance > 0
- **Pending** ❌: No payments made
- **Overpaid** 💰: Negative balance (paid more than expected)

## Bursary Types

### 1. **None (No Bursary)**

- Student pays full class fee
- Expected Fee = Class Fee
- Example: Baby Class student pays UGX 200,000

### 2. **Partial Bursary**

- Student receives percentage discount (1-99%)
- Expected Fee = Class Fee - (Class Fee × Bursary %)
- Example: P.3 student with 50% bursary
  - Base Fee: UGX 290,000
  - Discount: UGX 145,000
  - **Expected Fee: UGX 145,000**

### 3. **Full Bursary**

- Student receives 100% discount
- Expected Fee = UGX 0
- Typically for orphans, church sponsorships, or extreme hardship
- Example: P.7 student with full bursary pays nothing

## Sample Bursary Students

### Ode Tambo (P.3)

- **Bursary**: 50% Partial
- **Reason**: Single parent household
- **Base Fee**: UGX 290,000
- **Discount**: UGX 145,000
- **Expected Fee**: UGX 145,000
- **Paid**: UGX 40,000
- **Balance**: UGX 105,000

### Musa Traore (P.6)

- **Bursary**: 75% Partial
- **Reason**: Sibling discount + financial hardship
- **Base Fee**: UGX 350,000
- **Discount**: UGX 262,500
- **Expected Fee**: UGX 87,500
- **Paid**: UGX 25,000
- **Balance**: UGX 62,500

### Habiba Jalloh (P.7)

- **Bursary**: 100% Full
- **Reason**: Orphaned child - church sponsorship
- **Base Fee**: UGX 370,000
- **Discount**: UGX 370,000
- **Expected Fee**: UGX 0
- **Paid**: UGX 20,000 (for lunch/uniform)
- **Balance**: -UGX 20,000 (overpaid)

## Adding/Editing Pupils with Bursaries

### In the Pupil Dialog:

1. **Select Bursary Type**:

   - None → No discount
   - Partial → Enter custom percentage (1-99%)
   - Full → Automatically sets to 100%

2. **Enter Bursary Reason** (for Partial/Full):

   - Single parent household
   - Sibling discount
   - Financial hardship
   - Orphaned child
   - Church/NGO sponsorship
   - Academic scholarship
   - etc.

3. **Fee Calculation Preview**:
   The dialog shows real-time calculation:
   ```
   Base Fee: UGX 290,000
   Discount (50%): -UGX 145,000
   ───────────────────────
   Expected Fee: UGX 145,000
   ```

## Payment Processing

### When Recording a Payment:

1. Amount is added to `totalPaid`
2. Amount is deducted from `balance`
3. System maintains accurate running totals
4. Receipt number automatically generated

### When Deleting a Payment:

1. Amount is subtracted from `totalPaid`
2. Amount is added back to `balance`
3. Ensures data integrity

### When Editing a Payment:

1. Difference is calculated
2. `totalPaid` and `balance` are adjusted accordingly

## Visual Indicators

### In Pupils Table:

- **Gift Icon** 🎁: Shown next to students with bursaries
- **Balance Color**:
  - Red: Outstanding balance
  - Green: Fully paid or overpaid
- **Status Badge**:
  - Green: Paid
  - Orange: Partial
  - Red: Pending
  - Gray: Overpaid

### In Pupil Details Page:

- Four summary cards: Expected Fee, Total Paid, Balance, Class
- Bursary information prominently displayed
- Complete payment history with receipt numbers

## Common Bursary Scenarios

### Sibling Discount

Multiple children from same family get 10-25% discount:

```
Family with 3 children:
- Child 1 (P.5): 15% discount
- Child 2 (P.3): 15% discount
- Child 3 (P.1): 15% discount
```

### Need-Based Aid

Based on family financial situation (25-75%):

```
Low-income family:
- 50% bursary on UGX 300,000 fee
- Pay only UGX 150,000 per term
```

### Full Scholarships

For exceptional circumstances (100%):

```
Orphaned student:
- Church sponsorship covers 100%
- Parents still pay for lunch/uniform separately
```

## Reports & Analytics

The AI Financial Advisor now considers:

- Students on bursaries (financial aid expense)
- Collection rates by bursary type
- Outstanding balances from bursary students
- Impact of financial aid on school revenue

## Best Practices

1. **Document Bursary Reasons**: Always record why aid was granted
2. **Regular Review**: Reassess bursaries each term/year
3. **Track Separately**: Lunch/uniform payments separate from tuition
4. **Clear Communication**: Ensure guardians understand expected fees
5. **Consistent Application**: Apply bursary policies fairly

## Future Enhancements

- **Bursary Application Form**: Online form for guardians
- **Approval Workflow**: Admin approval for bursary requests
- **Expiry Dates**: Time-limited bursaries with renewal
- **Sponsor Tracking**: Link bursaries to specific sponsors/donors
- **Impact Reports**: Show total financial aid provided
