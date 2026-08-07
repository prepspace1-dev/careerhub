import React, { useState } from "react";
import { supabase, isSupabaseConfigured } from "../supabaseClient";
import { useApp } from "../context/AppContext";
import { Mail, Lock, Sparkles, ArrowRight, Laptop } from "lucide-react";

export default function Auth() {
  const { loginOffline } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasSupabase = isSupabaseConfigured();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!hasSupabase) {
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
    } catch (err) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      color: "var(--text-primary)",
      padding: "24px"
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: "100%",
        maxWidth: "440px",
        padding: "36px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)"
      }}>
        {/* Header Logo */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            margin: "0 auto 16px",
            boxShadow: "0 8px 20px var(--glow-accent)"
          }}>
            <Sparkles size={24} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-primary)" }}>
            CAREERHUB V2
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
            The 30-Day SDE Transformation Platform
          </p>
        </div>

        {/* Error / Alert banner */}
        {error && (
          <div style={{
            padding: "10px 14px",
            borderRadius: "10px",
            background: "rgba(244, 63, 94, 0.12)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            color: "var(--accent-rose)",
            fontSize: "13px",
            fontWeight: 600,
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Email Address
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "var(--bg-input)",
              border: "var(--glass-border)"
            }}>
              <Mail size={18} style={{ color: "var(--text-muted)" }} />
              <input
                required
                type="email"
                placeholder="prepspace1@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  color: "var(--text-primary)"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Password
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "var(--bg-input)",
              border: "var(--glass-border)"
            }}>
              <Lock size={18} style={{ color: "var(--text-muted)" }} />
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  color: "var(--text-primary)"
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "8px",
              padding: "14px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))",
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 8px 20px -4px var(--glow-accent)",
              opacity: loading ? 0.7 : 1
            }}
          >
            <span>{loading ? "Signing in..." : isSignUp ? "Create Account" : "Sign In to Platform"}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        {hasSupabase && (
          <div style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ color: "var(--accent-indigo)", fontWeight: 700 }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        )}

        {/* Offline / Local Mode Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-muted)", fontSize: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span>OR</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        <button
          type="button"
          onClick={loginOffline}
          style={{
            padding: "12px",
            borderRadius: "10px",
            background: "var(--bg-input)",
            border: "var(--glass-border)",
            color: "var(--text-secondary)",
            fontWeight: 600,
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          <Laptop size={16} />
          <span>Continue in Offline Local Mode</span>
        </button>
      </div>
    </div>
  );
}
