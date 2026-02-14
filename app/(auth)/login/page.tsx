"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils/cn";

type Role = "student" | "warden" | null;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email, password, selectedRole ?? "student");
    setLoading(false);
    if (err) {
      setError(err.message || "Invalid email or password.");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <AnimatePresence mode="wait">
        {!selectedRole ? (
          <motion.div
            key="role-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl"
          >
            <div className="text-center mb-8">
              <h1 className="font-accent text-3xl font-bold text-text-primary">
                Welcome back
              </h1>
              <p className="text-text-muted mt-2">
                Sign in to your AASHRAY account
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Student Card */}
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card
                  className="rounded-3xl border-surface-dark shadow-soft cursor-pointer hover:shadow-soft-lg hover:border-primary/40 transition-all"
                  onClick={() => setSelectedRole("student")}
                >
                  <CardContent className="flex flex-col items-center py-10 px-6 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-primary-dark" />
                    </div>
                    <CardTitle className="font-accent text-xl">Student</CardTitle>
                    <CardDescription className="text-center">
                      Find safe & verified student housing near your campus
                    </CardDescription>
                    <Button variant="outline" className="mt-2 rounded-xl border-primary/30 text-primary-dark hover:bg-primary/10">
                      Sign in as Student
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Warden Card */}
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card
                  className="rounded-3xl border-surface-dark shadow-soft cursor-pointer hover:shadow-soft-lg hover:border-primary/40 transition-all"
                  onClick={() => setSelectedRole("warden")}
                >
                  <CardContent className="flex flex-col items-center py-10 px-6 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-accent-success/10 flex items-center justify-center">
                      <ShieldCheck className="w-8 h-8 text-accent-success" />
                    </div>
                    <CardTitle className="font-accent text-xl">Warden</CardTitle>
                    <CardDescription className="text-center">
                      Manage your properties, bookings & student safety
                    </CardDescription>
                    <Button variant="outline" className="mt-2 rounded-xl border-accent-success/30 text-accent-success hover:bg-accent-success/10">
                      Sign in as Warden
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            <p className="mt-6 text-center text-sm text-text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <Card className="rounded-3xl border-surface-dark shadow-soft">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center",
                      selectedRole === "student"
                        ? "bg-primary/10"
                        : "bg-accent-success/10"
                    )}
                  >
                    {selectedRole === "student" ? (
                      <GraduationCap className="w-7 h-7 text-primary-dark" />
                    ) : (
                      <ShieldCheck className="w-7 h-7 text-accent-success" />
                    )}
                  </div>
                </div>
                <CardTitle className="font-accent text-2xl">
                  {selectedRole === "student" ? "Student Login" : "Warden Login"}
                </CardTitle>
                <CardDescription>
                  {selectedRole === "student"
                    ? "Access your student dashboard"
                    : "Manage your properties & bookings"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <p className="text-sm text-accent-danger bg-accent-danger/10 rounded-xl p-3">
                      {error}
                    </p>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole(null);
                      setError("");
                      setEmail("");
                      setPassword("");
                    }}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    ← Back to role selection
                  </button>
                  <Link href="/signup" className="text-primary font-medium hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
