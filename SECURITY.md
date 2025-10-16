# Security Documentation - Lady Sydah Bursar

## 🔒 Security Overview

This document outlines the security measures implemented in the Lady Sydah Bursar system.

## Authentication & Authorization

### Firebase Authentication

- **Email/Password Authentication**: Secure user authentication with Firebase
- **Password Requirements**: Minimum 6 characters (Firebase default)
- **Session Management**: JWT tokens with automatic refresh
- **Password Reset**: Email-based password reset flow

### Role-Based Access Control (RBAC)

#### User Roles

1. **ADMIN**

   - Full system access
   - Can create/modify users
   - Can delete any records
   - Access to audit logs
   - Can modify system settings

2. **BURSAR**

   - Can create/edit pupils
   - Can create/edit payments
   - Can create/edit expenses
   - Can generate reports
   - Cannot delete records
   - Cannot manage users

3. **TEACHER**

   - Read-only access to pupils
   - Read-only access to payments
   - Cannot create/edit/delete
   - Can view reports

4. **VIEW_ONLY**
   - Read-only access to all data
   - Cannot create/edit/delete anything
   - Can view reports

### Access Control Implementation

```typescript
// Check user role
function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

// Usage
if (hasRole(user.role, ["ADMIN", "BURSAR"])) {
  // Allow action
}
```

## Data Security

### Firestore Security Rules

All data access is controlled by Firestore security rules:

```javascript
// Only authenticated users can read
allow read: if request.auth != null;

// Only ADMIN and BURSAR can write
allow write: if request.auth != null &&
  (getUserRole() == 'ADMIN' || getUserRole() == 'BURSAR');

// Only ADMIN can delete
allow delete: if request.auth != null && getUserRole() == 'ADMIN';
```

### Data Validation

All data is validated before being saved:

```typescript
// Example: Payment validation
validatePayment(payment, pupil);
// - Amount must be positive
// - Date cannot be in future
// - Amount shouldn't exceed balance by too much
// - Receipt number format validation
```

### Audit Logging

Every create, update, and delete operation is logged:

```typescript
interface AuditLog {
  userId: string;
  userEmail: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  resource: "PUPIL" | "PAYMENT" | "EXPENSE";
  resourceId: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
}
```

## Environment Variables

### Required Variables

```bash
# Firebase Configuration (NEVER commit these!)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# App Configuration
NEXT_PUBLIC_APP_URL=
NODE_ENV=
```

### Security Best Practices

1. **NEVER** commit `.env.local` to version control
2. Use different Firebase projects for dev/staging/production
3. Rotate API keys regularly
4. Enable Firebase App Check in production
5. Set up Firebase budget alerts

## API Security

### Error Handling

Never expose sensitive information in error messages:

```typescript
// ❌ Bad
throw new Error(`Database connection failed: ${connectionString}`);

// ✅ Good
throw new Error("Failed to connect to database");
// Log full error server-side only
```

### Rate Limiting

Implement rate limiting for sensitive operations:

```typescript
// Firestore has built-in rate limiting
// Additional app-level rate limiting can be added
```

## Client-Side Security

### XSS Prevention

- All user input is sanitized
- React automatically escapes JSX content
- Use `dangerouslySetInnerHTML` with extreme caution

### CSRF Protection

- Firebase Authentication handles CSRF tokens
- SameSite cookie policy set to 'lax'

### Secure Data Transmission

- All Firebase communication uses HTTPS
- No sensitive data in URLs or localStorage
- Session tokens stored securely by Firebase

## Backup & Recovery

### Automated Backups

```typescript
// Backup all data
const backup = await backupAllData();
// Save to secure location

// Restore from backup
await restoreFromBackup(backup);
```

### Backup Strategy

1. **Daily automatic backups** to Firebase Storage
2. **Weekly manual backups** downloaded locally
3. **Monthly archival backups** to external storage
4. **Retention**: Keep last 30 daily, 12 weekly, 12 monthly backups

## Incident Response

### In Case of Security Breach

1. **Immediate Actions**

   - Revoke all user sessions
   - Disable compromised accounts
   - Enable Firebase Auth IP restrictions
   - Review audit logs

2. **Investigation**

   - Check Firestore audit logs
   - Review Firebase Auth logs
   - Identify affected data
   - Document timeline

3. **Recovery**

   - Restore from last known good backup
   - Reset all user passwords
   - Update security rules if needed
   - Notify affected users

4. **Prevention**
   - Update security measures
   - Additional monitoring
   - Staff security training
   - Review and update policies

## Security Checklist

### Pre-Production

- [ ] Firebase security rules properly configured
- [ ] All environment variables set
- [ ] No hardcoded credentials
- [ ] Error messages don't leak sensitive info
- [ ] Audit logging enabled
- [ ] Backup system tested
- [ ] Rate limiting configured
- [ ] HTTPS enforced
- [ ] Content Security Policy headers set

### Regular Maintenance

- [ ] Review audit logs weekly
- [ ] Update dependencies monthly
- [ ] Security audit quarterly
- [ ] Test backup restoration quarterly
- [ ] Review user permissions quarterly
- [ ] Rotate API keys annually

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email security concerns to: [security email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Compliance

### Data Protection

- User data is stored in Firebase Firestore (Google Cloud)
- Data is encrypted at rest and in transit
- Users can request data deletion
- Audit trail maintained for compliance

### GDPR Compliance (if applicable)

- Right to access: Users can export their data
- Right to erasure: Users can request deletion
- Right to rectification: Users can update their data
- Data portability: Backup/export functionality
- Consent management: Clear terms and privacy policy

## Additional Resources

- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/best-practices)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
