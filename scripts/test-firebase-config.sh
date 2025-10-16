#!/bin/bash

echo "🔥 Firebase Connection Test"
echo "=============================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
  echo "✅ .env.local file found"
else
  echo "❌ .env.local file not found!"
  exit 1
fi

# Check Firebase credentials
echo ""
echo "📋 Checking Firebase Configuration:"
echo ""

if grep -q "AIzaSyAsHr6kocHgOyFYE7LAgZYrF51jdag-QcI" .env.local; then
  echo "✅ Firebase API Key configured"
else
  echo "❌ Firebase API Key missing"
fi

if grep -q "studio-6885202677-8c895" .env.local; then
  echo "✅ Firebase Project ID configured"
else
  echo "❌ Firebase Project ID missing"
fi

if grep -q "AIzaSyC7vLuX9GPGFjHCmA2C4dwEuQcscGyHpOI" .env.local; then
  echo "✅ Google AI API Key configured"
else
  echo "❌ Google AI API Key missing"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Complete Firebase setup in console (see FIREBASE_ACTIVATION_CHECKLIST.md)"
echo "2. Restart dev server: npm run dev"
echo "3. Open http://localhost:9002"
echo ""
