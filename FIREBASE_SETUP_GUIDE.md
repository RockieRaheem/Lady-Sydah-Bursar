# Firebase Setup Guide for Lady Sydah Bursar

This guide will walk you through setting up Firebase for the Lady Sydah Bursar application.

## Prerequisites

- A Google account
- Node.js installed on your machine
- The Lady Sydah Bursar project

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `lady-sydah-bursar` (or your preferred name)
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

## Step 2: Register Web App

1. In your Firebase project, click the Web icon (`</>`)
2. Register app with nickname: `Lady Sydah Bursar Web`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object (you'll need this later)

## Step 3: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

### Create First Admin User

1. Go to Authentication → Users tab
2. Click "Add user"
3. Enter email: `bursar@ladysydah.com` (or your admin email)
4. Enter password (minimum 6 characters)
5. Click "Add user"
6. Copy the User UID (you'll need this)

## Step 4: Set Up Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (we'll secure it later)
4. Select your Cloud Firestore location (choose closest to your users)
5. Click "Enable"

### Create User Profile for Admin

1. In Firestore, click "Start collection"
2. Collection ID: `users`
3. Add first document:
   - Document ID: [paste the User UID from step 3]
   - Fields:
     - `uid` (string): [same UID]
     - `email` (string): `bursar@ladysydah.com`
     - `displayName` (string): `System Administrator`
     - `role` (string): `ADMIN`
     - `createdAt` (string): [current date ISO format]
     - `lastLogin` (string): [current date ISO format]
4. Click "Save"

### Initialize School Classes

1. In Firestore, click "Start collection"
2. Collection ID: `schoolClasses`
3. Add documents for each class:

**Baby Class:**

- Document ID: `baby`
- Fields:
  - `id` (string): `baby`
  - `name` (string): `Baby Class`
  - `termlyFee` (number): `200000`

**Middle Class:**

- Document ID: `middle`
- Fields:
  - `id` (string): `middle`
  - `name` (string): `Middle Class`
  - `termlyFee` (number): `220000`

**Top Class:**

- Document ID: `top`
- Fields:
  - `id` (string): `top`
  - `name` (string): `Top Class`
  - `termlyFee` (number): `240000`

Repeat for P.1 through P.7 with their respective fees.

## Step 5: Update Security Rules

1. In Firestore, go to "Rules" tab
2. Copy the contents from `firestore.rules` in this project
3. Paste into the Firebase Console rules editor
4. Click "Publish"

## Step 6: Configure Environment Variables

1. Copy the Firebase config from Step 2
2. Create `.env.local` file in project root:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_APP_URL=http://localhost:9002
NODE_ENV=development
```

3. Replace all `your_*` placeholders with actual values from Firebase config

## Step 7: Test the Connection

1. Start the development server:

```bash
npm run dev
```

2. Navigate to `http://localhost:9002/login`
3. Try logging in with the admin credentials you created
4. If successful, you should be redirected to the dashboard

## Step 8: Migrate Existing Data (Optional)

If you have existing data in the application, you can migrate it:

1. Open the browser console on the dashboard
2. Run the migration script (will be provided)
3. Verify data appears in Firestore

## Security Best Practices

### Production Security Rules

Before deploying to production, ensure your Firestore rules are properly configured:

1. Go to Firestore → Rules
2. Verify all rules check authentication
3. Verify role-based access is enforced
4. Test rules using the Rules Playground

### Environment Variables

- **NEVER** commit `.env.local` to git
- Use Firebase Hosting environment config for production
- Rotate API keys regularly
- Limit API key restrictions in Firebase Console

### User Management

1. Disable test mode after initial setup
2. Enable email verification (optional)
3. Set up password policies
4. Enable multi-factor authentication (MFA) for admins

## Troubleshooting

### Authentication Issues

**Error: "Firebase: Error (auth/invalid-api-key)"**

- Solution: Check your API key in `.env.local`

**Error: "Firebase: Error (auth/network-request-failed)"**

- Solution: Check your internet connection and Firebase project status

### Firestore Issues

**Error: "Missing or insufficient permissions"**

- Solution: Check Firestore rules and ensure user has proper role

**Error: "PERMISSION_DENIED"**

- Solution: Verify user is authenticated and has correct role in Firestore

### Connection Issues

**Error: Cannot connect to Firebase**

- Solution: Verify all environment variables are set correctly
- Check Firebase project is active
- Ensure billing is enabled (free tier is sufficient)

## Next Steps

1. ✅ Create additional admin/bursar users
2. ✅ Test CRUD operations for pupils, payments, expenses
3. ✅ Set up Firebase Hosting for production deployment
4. ✅ Configure backup strategy
5. ✅ Set up monitoring and alerts

## Support

For issues specific to Firebase:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)

For application-specific issues:

- Check the project README.md
- Review the implementation checklist
