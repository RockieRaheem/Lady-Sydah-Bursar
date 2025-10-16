# Firebase Activation Checklist

## ✅ Completed

- [x] Firebase project created: "Lady Sydah Junior Bursar SW"
- [x] Project ID: `studio-6885202677-8c895`
- [x] Firebase config added to `.env.local`
- [x] Google AI Studio API key configured

## 🔧 Required Actions in Firebase Console

### 1. Enable Authentication

**Go to:** [Firebase Console](https://console.firebase.google.com/project/studio-6885202677-8c895/authentication) → Authentication → Get Started

**Enable these sign-in methods:**

- [x] Email/Password
  1. Click "Email/Password"
  2. Enable the first toggle (Email/Password)
  3. Click "Save"

**Create first admin user:**

- Email: `admin@ladysydah.com`
- Password: (Choose a secure password)
- **IMPORTANT:** After creating the user, we'll need to set their role to "admin" in Firestore

### 2. Enable Firestore Database

**Go to:** [Firebase Console](https://console.firebase.google.com/project/studio-6885202677-8c895/firestore) → Firestore Database → Create Database

**Settings:**

- [x] Location: Choose closest region (e.g., `us-central`, `europe-west`, etc.)
- [x] Start in **Production mode** (we'll deploy our security rules)

### 3. Deploy Firestore Security Rules

After creating the database:

1. Go to Firestore → Rules tab
2. Copy the content from `firestore.rules` in this project
3. Paste it into the Firebase Console rules editor
4. Click "Publish"

**OR use Firebase CLI:**

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### 4. Create Initial Collections

We need to manually create the first user with admin role:

1. Go to Firestore → Data tab
2. Click "Start collection"
3. Collection ID: `users`
4. Document ID: (use the UID of the admin user you created)
5. Add fields:
   - `email` (string): `admin@ladysydah.com`
   - `role` (string): `admin`
   - `displayName` (string): `System Administrator`
   - `createdAt` (timestamp): (auto)
   - `updatedAt` (timestamp): (auto)

### 5. Enable Google AI (Gemini) - Optional but Recommended

**Go to:** [Google AI Studio](https://makersuite.google.com/app/apikey)

- [x] API Key already configured: `AIzaSyC7vLuX9GPGFjHCmA2C4dwEuQcscGyHpOI`

**Verify the API key has access to:**

- Gemini 1.5 Flash (for fast AI reports)
- Gemini 1.5 Pro (for complex analysis)

### 6. Configure Storage (Optional - for future features)

**Go to:** [Firebase Console](https://console.firebase.google.com/project/studio-6885202677-8c895/storage) → Storage → Get Started

This will be used for:

- Receipt uploads
- Document attachments
- Report exports

---

## 📝 What to Tell Me

After completing the above steps, please provide:

1. **Admin User UID**:

   - After creating the admin user in Authentication, copy their UID
   - Format: `AbCdEf1234567890XyZ`
   - I'll need this to set up the user profile in Firestore

2. **Firestore Region**:

   - What region did you select? (e.g., `us-central1`, `europe-west1`)

3. **Any Errors**:
   - Did you encounter any errors during setup?
   - Copy and paste any error messages

---

## 🚀 Quick Start Commands

Once you've completed the Firebase setup:

```bash
# 1. Restart the development server to load new environment variables
npm run dev

# 2. Test Firebase connection
# The app should now connect to your Firebase project

# 3. Try logging in with your admin credentials
# Go to: http://localhost:9002/login
```

---

## 📊 Expected Firestore Structure

After full setup, your database will have these collections:

```
📁 studio-6885202677-8c895 (Firestore)
├── 📂 users
│   └── {userId}
│       ├── email: string
│       ├── role: "admin" | "bursar" | "viewer"
│       ├── displayName: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── 📂 classes
│   └── {classId}
│       ├── name: string
│       ├── termlyFee: number
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── 📂 pupils
│   └── {pupilId}
│       ├── name: string
│       ├── classId: string
│       ├── admissionDate: timestamp
│       ├── guardianName: string
│       ├── guardianContact: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── 📂 payments
│   └── {paymentId}
│       ├── pupilId: string
│       ├── amount: number
│       ├── date: timestamp
│       ├── term: string
│       ├── academicYear: string
│       ├── notes: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── 📂 expenses
│   └── {expenseId}
│       ├── category: string
│       ├── amount: number
│       ├── date: timestamp
│       ├── description: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
└── 📂 audit_logs
    └── {logId}
        ├── userId: string
        ├── action: string
        ├── collection: string
        ├── documentId: string
        ├── timestamp: timestamp
        └── metadata: object
```

---

## 🔒 Security Notes

1. **Never commit `.env.local`** to version control (already in `.gitignore`)
2. **Change ADMIN_PASSWORD** in `.env.local` to a strong password
3. **Firestore rules** are already configured for role-based access
4. **API keys** should be rotated periodically
5. **Enable App Check** (optional but recommended for production)

---

## 📞 Need Help?

If you encounter issues:

1. Check the [Firebase Console](https://console.firebase.google.com/project/studio-6885202677-8c895)
2. Review error messages in browser console (F12)
3. Check the terminal where `npm run dev` is running
4. Provide me with error messages and I'll help troubleshoot
