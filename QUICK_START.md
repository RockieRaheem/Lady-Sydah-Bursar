# Quick Start Guide - Lady Sydah Bursar

Get up and running with the Lady Sydah Bursar system in 10 minutes!

## ⚡ Quick Setup

### 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/your-username/lady-sydah-bursar.git
cd lady-sydah-bursar

# Install dependencies
npm install
```

### 2. Firebase Setup (5 minutes)

**Create Firebase Project:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" → Name it "Lady Sydah Bursar"
3. Disable Google Analytics (optional)
4. Click "Create project"

**Add Web App:**

1. Click the Web icon (`</>`)
2. Register app → Copy the config object
3. You'll need: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`

**Enable Services:**

1. **Authentication**: Build → Authentication → Get started → Enable "Email/Password"
2. **Firestore**: Build → Firestore Database → Create database → Start in test mode

### 3. Configure Environment (1 minute)

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your Firebase credentials
nano .env.local  # or use your favorite editor
```

Paste your Firebase config:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lady-sydah-bursar.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lady-sydah-bursar
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lady-sydah-bursar.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc...
```

### 4. Create Admin User (1 minute)

In Firebase Console:

1. Go to Authentication → Users → Add user
2. Email: `admin@ladysydah.com`
3. Password: `YourSecurePassword123`
4. Copy the User UID

Create user profile in Firestore:

1. Go to Firestore Database → Start collection
2. Collection ID: `users`
3. Document ID: [paste the UID]
4. Add fields:
   ```
   uid: [same UID]
   email: admin@ladysydah.com
   displayName: System Administrator
   role: ADMIN
   createdAt: 2025-01-15T10:00:00.000Z
   lastLogin: 2025-01-15T10:00:00.000Z
   ```

### 5. Initialize School Classes (1 minute)

In Firestore, create `schoolClasses` collection with these documents:

```javascript
// baby (Document ID: baby)
{ id: "baby", name: "Baby Class", termlyFee: 200000 }

// middle (Document ID: middle)
{ id: "middle", name: "Middle Class", termlyFee: 220000 }

// top (Document ID: top)
{ id: "top", name: "Top Class", termlyFee: 240000 }

// p1 (Document ID: p1)
{ id: "p1", name: "P.1", termlyFee: 250000 }

// p2 (Document ID: p2)
{ id: "p2", name: "P.2", termlyFee: 270000 }

// p3 (Document ID: p3)
{ id: "p3", name: "P.3", termlyFee: 290000 }

// p4 (Document ID: p4)
{ id: "p4", name: "P.4", termlyFee: 310000 }

// p5 (Document ID: p5)
{ id: "p5", name: "P.5", termlyFee: 330000 }

// p6 (Document ID: p6)
{ id: "p6", name: "P.6", termlyFee: 350000 }

// p7 (Document ID: p7)
{ id: "p7", name: "P.7", termlyFee: 370000 }
```

### 6. Start the App! (30 seconds)

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002)

Login with:

- Email: `admin@ladysydah.com`
- Password: [what you set in step 4]

## ✅ Verify Everything Works

### Test Checklist:

1. [ ] Can login successfully
2. [ ] Dashboard loads
3. [ ] Can see all 10 classes
4. [ ] Can add a new pupil
5. [ ] Can record a payment
6. [ ] Can generate a receipt
7. [ ] Can view reports

## 🎯 Next Steps

### Add More Users

1. Go to Firebase Console → Authentication
2. Add user with email/password
3. Go to Firestore → users collection
4. Create document with user details and role

### Customize Settings

1. Edit `src/lib/data.ts` for fee amounts
2. Update `src/app/layout.tsx` for branding
3. Modify `tailwind.config.ts` for colors

### Deploy to Production

```bash
# Build
npm run build

# Deploy to Vercel
vercel

# Or deploy to Firebase Hosting
firebase deploy
```

## 🔧 Troubleshooting

### Can't Login?

- Check Firebase Authentication is enabled
- Verify user exists in Firebase Console
- Check `.env.local` has correct credentials
- Look for errors in browser console

### No Data Showing?

- Verify Firestore rules allow read/write
- Check schoolClasses collection exists
- Ensure user has correct role in Firestore
- Check browser network tab for errors

### Build Errors?

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Firebase Connection Error?

- Verify all environment variables are set
- Check Firebase project is active
- Ensure billing is enabled (free tier is fine)
- Test internet connection

## 📚 Detailed Guides

For more detailed information:

- [Firebase Setup Guide](./FIREBASE_SETUP_GUIDE.md) - Complete Firebase configuration
- [Security Documentation](./SECURITY.md) - Security best practices
- [Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md) - Development progress

## 🆘 Need Help?

Common issues and solutions:

**"Cannot find module '@/...'**
→ Run `npm install` again

**"Module not found: Can't resolve 'firebase/app'"**
→ Firebase is installed. Clear cache: `rm -rf .next && npm run dev`

**"Permission denied" in Firestore**
→ Check security rules and user role

**"Invalid API key"**
→ Double-check `.env.local` credentials

**Port 9002 already in use**
→ Kill process: `lsof -ti:9002 | xargs kill -9`

## 💡 Pro Tips

1. **Use Firebase Emulator** for local development
2. **Enable Firebase App Check** in production
3. **Set up automated backups** weekly
4. **Monitor Firebase usage** to avoid quota limits
5. **Use environment-specific configs** for dev/staging/prod

## 🚀 Production Checklist

Before going live:

- [ ] Environment variables set in hosting platform
- [ ] Firestore security rules published
- [ ] Firebase App Check enabled
- [ ] HTTPS enforced
- [ ] Backup system configured
- [ ] Monitoring setup
- [ ] User roles configured
- [ ] Test all critical flows
- [ ] Performance testing done
- [ ] Security audit completed

---

**🎉 Congratulations! You're ready to manage school finances efficiently!**
