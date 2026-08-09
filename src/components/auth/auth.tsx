"use client";

import React, { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useApp } from "@/context/app-context";
import { Mail, Lock, Sparkles, ArrowRight, Laptop } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Auth() {
  const { loginOffline } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasSupabase = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasSupabase || !supabase) {
      loginOffline();
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password
        });
        if (signUpErr) throw signUpErr;
        if (data?.user && !data.session) {
          setError("Confirmation link sent! Please check your email inbox.");
        }
      } else {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInErr) throw signInErr;
      }
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6">
      <Card className="w-full max-w-md border-border/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <CardContent className="p-0 space-y-6">
          {/* Header Logo */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <Sparkles size={24} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              CAREERHUB V2
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              The 30-Day SDE Transformation Platform
            </p>
          </div>

          {/* Alert Banner */}
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-center text-xs font-semibold text-rose-500">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="email"
                  placeholder="prepspace1@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="gradient"
              className="w-full py-5 text-sm font-bold gap-2 shadow-lg shadow-blue-500/20"
            >
              <span>{loading ? "Signing in..." : isSignUp ? "Create Account" : "Sign In to Platform"}</span>
              <ArrowRight size={16} />
            </Button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          {hasSupabase && (
            <div className="text-center text-xs text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-bold text-blue-500 hover:underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          )}

          {/* Offline Mode */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border/60" />
            <span>OR</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={loginOffline}
            className="w-full gap-2 text-xs font-semibold"
          >
            <Laptop size={15} />
            <span>Continue in Offline Local Mode</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
