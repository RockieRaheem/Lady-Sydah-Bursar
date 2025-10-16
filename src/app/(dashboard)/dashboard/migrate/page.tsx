/**
 * Data Migration Page
 *
 * One-time setup page to migrate data from in-memory to Firestore
 * Access this at: /dashboard/migrate
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  migrateDataToFirestore,
  isMigrationNeeded,
} from "@/lib/firebase/migrate";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { CheckCircle, XCircle, Loader2, Database } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function MigratePage() {
  const { user } = useFirebaseAuth();
  const [status, setStatus] = useState<
    "idle" | "checking" | "migrating" | "complete" | "error"
  >("idle");
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const checkMigration = async () => {
    setStatus("checking");
    try {
      const needed = await isMigrationNeeded();
      if (!needed) {
        setStatus("complete");
        setResults({ message: "Data already exists in Firestore!" });
      } else {
        setStatus("idle");
      }
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Failed to check migration status"
      );
    }
  };

  const startMigration = async () => {
    if (!user) {
      setError("You must be logged in to perform migration");
      return;
    }

    setStatus("migrating");
    setProgress(0);
    setError(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const migrationResults = await migrateDataToFirestore(user.uid);

      clearInterval(progressInterval);
      setProgress(100);
      setResults(migrationResults);
      setStatus("complete");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Migration failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Migration</h1>
        <p className="text-muted-foreground">
          Migrate your data from in-memory storage to Firebase Firestore
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Firebase Data Migration
          </CardTitle>
          <CardDescription>
            This will copy all pupils, payments, expenses, and classes to your
            Firebase database. This is a one-time operation and should only be
            done once.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "idle" && (
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Before You Start</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Make sure Firebase is properly configured</li>
                    <li>Ensure you have admin access</li>
                    <li>
                      This will migrate approximately:
                      <ul className="list-none ml-4 mt-1">
                        <li>• 7 School Classes</li>
                        <li>• 10 Sample Pupils</li>
                        <li>• 15 Payment Records</li>
                        <li>• 8 Expense Records</li>
                      </ul>
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button onClick={checkMigration}>Check Migration Status</Button>
                <Button onClick={startMigration} variant="default">
                  Start Migration
                </Button>
              </div>
            </div>
          )}

          {status === "checking" && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Checking Firestore status...</span>
            </div>
          )}

          {status === "migrating" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Migrating data to Firestore...</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {progress}% complete
              </p>
            </div>
          )}

          {status === "complete" && results && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">
                Migration Completed Successfully!
              </AlertTitle>
              <AlertDescription>
                {results.message ? (
                  <p>{results.message}</p>
                ) : (
                  <ul className="space-y-1 mt-2">
                    <li>✅ Classes migrated: {results.classes}</li>
                    <li>✅ Pupils migrated: {results.pupils}</li>
                    <li>✅ Payments migrated: {results.payments}</li>
                    <li>✅ Expenses migrated: {results.expenses}</li>
                    {results.errors && results.errors.length > 0 && (
                      <li className="text-amber-600">
                        ⚠️ Errors: {results.errors.length}
                      </li>
                    )}
                  </ul>
                )}
                <p className="mt-4 font-semibold">
                  Your data is now safely stored in Firebase Firestore!
                </p>
                <p className="text-sm mt-2">
                  You can now use the system normally. All changes will be
                  persisted to the cloud database.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Migration Failed</AlertTitle>
              <AlertDescription>
                {error}
                <Button
                  onClick={() => setStatus("idle")}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {results && results.errors && results.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTitle>Some Errors Occurred</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {results.errors.slice(0, 5).map((err: string, i: number) => (
                    <li key={i} className="text-sm">
                      {err}
                    </li>
                  ))}
                  {results.errors.length > 5 && (
                    <li className="text-sm">
                      ... and {results.errors.length - 5} more errors
                    </li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Happens During Migration?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>School classes are created in Firestore</li>
            <li>Pupil records are migrated with all details</li>
            <li>Payment history is transferred</li>
            <li>Expense records are copied</li>
            <li>An audit log entry is created</li>
            <li>All data is validated before saving</li>
          </ol>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-semibold">🔒 Security Benefits:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
              <li>Data persists even if the app crashes</li>
              <li>Works across different devices</li>
              <li>Automatic backups by Firebase</li>
              <li>Can change operating systems without data loss</li>
              <li>Real-time synchronization</li>
              <li>Offline support</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
