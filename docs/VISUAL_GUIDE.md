# 🎓 Bursary System - Quick Visual Guide

## 🎯 Key Concepts at a Glance

### Fee Structure Flow

```
┌─────────────────────────────────────────────────────┐
│  PUPIL REGISTRATION                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Select Class → Base Fee Applied                │
│     Example: P.3 = UGX 290,000                     │
│                                                     │
│  2. Choose Bursary Type:                           │
│     ├─ None (0%)                                   │
│     ├─ Partial (Custom %)                          │
│     └─ Full (100%)                                 │
│                                                     │
│  3. System Calculates:                             │
│     Expected Fee = Base Fee - Discount             │
│                                                     │
│  4. Pupil Starts With:                             │
│     • Total Paid: UGX 0                            │
│     • Balance: Expected Fee                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Payment Processing Flow

```
┌─────────────────────────────────────────────────────┐
│  PAYMENT RECORDED                                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Guardian pays: UGX 50,000                         │
│                                                     │
│  System Updates:                                    │
│  ├─ Total Paid: +50,000                            │
│  ├─ Balance: -50,000                               │
│  ├─ Receipt: Auto-generated (RCP-2025-XXX)         │
│  └─ Status: Auto-calculated                        │
│                                                     │
│  Payment Status Logic:                             │
│  • Balance = 0    → ✅ PAID                        │
│  • Balance > 0    → ⚠️ PARTIAL or ❌ PENDING       │
│  • Balance < 0    → 💰 OVERPAID                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 📋 Bursary Examples

### Example 1: No Bursary (Standard Student)

```
┌──────────────────────────────────────┐
│  ABENI ADEBAYO - P.3                 │
├──────────────────────────────────────┤
│  Base Fee:        UGX 290,000        │
│  Bursary:         None (0%)          │
│  Discount:        UGX 0              │
│  ──────────────────────────────      │
│  Expected Fee:    UGX 290,000        │
│                                      │
│  Total Paid:      UGX 100,000        │
│  Balance:         UGX 190,000 ❌     │
│  Status:          PARTIAL            │
└──────────────────────────────────────┘
```

### Example 2: Partial Bursary (50%)

```
┌──────────────────────────────────────┐
│  ODE TAMBO - P.3                     │
├──────────────────────────────────────┤
│  Base Fee:        UGX 290,000        │
│  Bursary:         Partial (50%) 🎁   │
│  Discount:        UGX 145,000        │
│  ──────────────────────────────      │
│  Expected Fee:    UGX 145,000        │
│  Reason:          Single parent      │
│                                      │
│  Total Paid:      UGX 40,000         │
│  Balance:         UGX 105,000 ❌     │
│  Status:          PARTIAL            │
└──────────────────────────────────────┘
```

### Example 3: Full Bursary (100%)

```
┌──────────────────────────────────────┐
│  HABIBA JALLOH - P.7                 │
├──────────────────────────────────────┤
│  Base Fee:        UGX 370,000        │
│  Bursary:         Full (100%) 🎁     │
│  Discount:        UGX 370,000        │
│  ──────────────────────────────      │
│  Expected Fee:    UGX 0              │
│  Reason:          Orphan/Church      │
│                                      │
│  Total Paid:      UGX 20,000         │
│  Balance:         -UGX 20,000 💰     │
│  Status:          OVERPAID           │
│  Note:            Lunch/uniform only │
└──────────────────────────────────────┘
```

## 🎨 UI Elements

### Pupils Table View

```
┌────────────────────────────────────────────────────────────────────────┐
│ Name          │ Guardian    │ Contact  │ Paid    │ Balance  │ Status  │
├────────────────────────────────────────────────────────────────────────┤
│ Abeni Adebayo │ Mr. Adebayo │ 0712...  │ 100,000 │  190,000 │ PARTIAL │
│ Ode Tambo 🎁  │ Mr. Tambo   │ 0713...  │  40,000 │  105,000 │ PARTIAL │
│ Habiba J. 🎁  │ Mrs. Jalloh │ 0714...  │  20,000 │  -20,000 │ OVERPAID│
│ Baraka C.     │ Ms. Chibuzo │ 0715...  │ 290,000 │        0 │ PAID ✅ │
└────────────────────────────────────────────────────────────────────────┘

🎁 = Student has bursary
```

### Add/Edit Pupil Dialog

```
┌─────────────────────────────────────────────────────┐
│  Add New Pupil                                  [X] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Pupil Name: [John Doe________________]            │
│                                                     │
│  Class: [P.3 - UGX 290,000 ▼]                      │
│                                                     │
│  Guardian's Name: [Jane Doe___________]            │
│                                                     │
│  Guardian's Contact: [0712345678_______]           │
│                                                     │
│  ┌────────────────────────────────────────────┐    │
│  │ 📋 Bursary/Financial Aid                   │    │
│  ├────────────────────────────────────────────┤    │
│  │                                            │    │
│  │ Bursary Type: [Partial ▼]                 │    │
│  │                                            │    │
│  │ Discount Percentage: [50______] %         │    │
│  │                                            │    │
│  │ Reason:                                    │    │
│  │ [Single parent household________]          │    │
│  │ [_________________________________]        │    │
│  │                                            │    │
│  │ ─────────────────────────────────────     │    │
│  │ Base Fee:         UGX 290,000             │    │
│  │ Discount (50%):  -UGX 145,000             │    │
│  │ ═══════════════════════════════════       │    │
│  │ Expected Fee:     UGX 145,000             │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
│                  [Cancel]  [Save Pupil]            │
└─────────────────────────────────────────────────────┘
```

### Pupil Detail Page

```
┌─────────────────────────────────────────────────────┐
│ [←] Habiba Jalloh                                   │
│     Payment history and details                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│ │ Expected Fee│ │ Total Paid  │ │  Balance    │   │
│ │    UGX 0    │ │  UGX 20,000 │ │ -UGX 20,000 │   │
│ │             │ │ 1 payment   │ │  OVERPAID💰 │   │
│ │ 🎁 100% aid │ │             │ │             │   │
│ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                     │
│ ┌────────────────────────────────────────────┐    │
│ │ 👤 Pupil Information                       │    │
│ ├────────────────────────────────────────────┤    │
│ │ Guardian: Mrs. Jalloh                      │    │
│ │ Contact: 0714567890                        │    │
│ │                                            │    │
│ │ 🎁 Bursary: Full (100%)                    │    │
│ │ Reason: Orphaned child - church            │    │
│ └────────────────────────────────────────────┘    │
│                                                     │
│ ┌────────────────────────────────────────────┐    │
│ │ 📜 Payment History                         │    │
│ ├────────────────────────────────────────────┤    │
│ │ Date       Type    Receipt      Amount     │    │
│ │ 2025-01-18 Other   RCP-2025-008  20,000    │    │
│ └────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## 🎯 Common Workflows

### Workflow 1: Register Student with Bursary

```
1. Click "Add Pupil" button
2. Enter student name and guardian info
3. Select class (fee appears automatically)
4. Choose bursary type (None/Partial/Full)
5. If Partial: enter percentage (e.g., 50%)
6. If Partial/Full: enter reason
7. Review calculated expected fee
8. Click "Save Pupil"
   ✅ Student added with correct fee structure
```

### Workflow 2: Record Payment

```
1. Go to Payments page
2. Click "Add Payment"
3. Select pupil from dropdown
4. Enter amount and date
5. Choose payment type (Tuition/Lunch/etc)
6. Click "Save Payment"
   ✅ Balance updates automatically
   ✅ Receipt number generated
   ✅ Status recalculated
```

### Workflow 3: View Bursary Students

```
1. Go to Pupils page
2. Look for 🎁 icon next to names
3. Click on student name
4. View complete bursary information
5. See expected fee vs. actual payments
   ✅ All bursary details visible
   ✅ Payment status clear
```

## 📊 Status Badge Legend

| Badge           | Meaning        | When It Shows            |
| --------------- | -------------- | ------------------------ |
| ✅ **PAID**     | Fully paid     | Balance = 0              |
| ⚠️ **PARTIAL**  | Partially paid | Paid > 0 and Balance > 0 |
| ❌ **PENDING**  | Not paid yet   | Paid = 0 and Balance > 0 |
| 💰 **OVERPAID** | Paid too much  | Balance < 0              |

## 🎨 Color Coding

- **Green** 🟢: Positive (paid, no balance)
- **Red** 🔴: Negative (owes money)
- **Orange** 🟠: Warning (partial payment)
- **Blue** 🔵: Information (bursary icon)

---

**Quick Tip**: Look for the 🎁 gift icon to quickly identify students receiving financial aid!
