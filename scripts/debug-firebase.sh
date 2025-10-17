#!/bin/bash

echo "🔍 Debugging Firebase Authentication Issue"
echo "==========================================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local exists"
    echo ""
    echo "📋 Environment Variables (sanitized):"
    grep "NEXT_PUBLIC_FIREBASE" .env.local | while read line; do
        key=$(echo "$line" | cut -d'=' -f1)
        value=$(echo "$line" | cut -d'=' -f2)
        if [ -n "$value" ]; then
            echo "  ✅ $key = ${value:0:20}..."
        else
            echo "  ❌ $key = (empty)"
        fi
    done
else
    echo "❌ .env.local not found!"
fi

echo ""
echo "🌐 Testing Firebase Console Access:"
echo "   Auth: https://console.firebase.google.com/project/studio-6885202677-8c895/authentication"
echo "   Firestore: https://console.firebase.google.com/project/studio-6885202677-8c895/firestore"
echo ""
echo "📝 Common Issues:"
echo "   1. Firebase Authentication not enabled in console"
echo "   2. No user created in Firebase Authentication"
echo "   3. User profile not created in Firestore"
echo "   4. Email/Password provider not enabled"
echo ""
