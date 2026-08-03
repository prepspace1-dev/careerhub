import React, { useState } from "react";
import { supabase, isSupabaseConfigured } from "../supabaseClient";
import { Mail, Lock, Sparkles, AlertCircle, Database, HelpCircle } from "lucide-react";

export default function Auth({ onAuthSuccess, onSkipAuth }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  const hasSupabase = isSupabaseConfigured();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!hasSupabase) return;
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpErr) throw signUpErr;
        
        // If email confirmation is enabled, we notify the user.
        if (data?.user && !data.session) {
          setError("Confirmation link sent! Please check your email inbox.");
        } else if (data?.session) {
          onAuthSuccess(data.session.user);
        }
      } else {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInErr) throw signInErr;
        if (data?.session) {
          onAuthSuccess(data.session.user);
        }
      }
    } catch (err) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={authStyles.container} className="fade-in">
      {loading && (
        <div style={authStyles.loadingOverlay}>
          <div style={authStyles.spinner}></div>
          <p style={authStyles.loadingText}>Connecting to Supabase...</p>
        </div>
      )}
      <div style={authStyles.header}>
        <div style={authStyles.logoRow}>
          <Sparkles size={20} color="#38D9C9" />
          <span style={authStyles.logoText}>CAREER HUB</span>
        </div>
        <h2 style={authStyles.title}>
          {hasSupabase 
            ? (isSignUp ? "Create your account" : "Sign in to your hub")
            : "Offline Local Mode"}
        </h2>
        <p style={authStyles.subtitle}>
          {hasSupabase
            ? "Sync your daily habits, skill maps, logs, and interview pipelines."
            : "Your database is stored locally in your browser. Configure keys later."}
        </p>
      </div>

      {!hasSupabase && (
        <div style={authStyles.warningBox}>
          <div style={authStyles.warningHeader}>
            <AlertCircle size={16} color="#F2A93B" />
            <span style={{ fontWeight: 600 }}>SUPABASE NOT CONNECTED</span>
          </div>
          <p style={authStyles.warningText}>
            No Supabase URL found in environmental variables. The application will store all data in your local browser storage.
          </p>
          <button 
            onClick={() => setShowGuide(!showGuide)} 
            style={authStyles.guideBtn}
          >
            <HelpCircle size={12} />
            {showGuide ? "Hide Setup Instructions" : "How to connect Supabase"}
          </button>

          {showGuide && (
            <div style={authStyles.guideContent}>
              <p>1. Create a project at <strong>supabase.com</strong></p>
              <p>2. Copy your <strong>API URL</strong> and <strong>Anon Key</strong></p>
              <p>3. Create a <code>.env.local</code> file in this folder:</p>
              <pre style={authStyles.codeBlock}>
{`VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key`}
              </pre>
              <p>4. Run the setup SQL script in Supabase's SQL Editor.</p>
            </div>
          )}
        </div>
      )}

      {hasSupabase ? (
        <form onSubmit={handleSubmit} style={authStyles.form}>
          {error && (
            <div style={authStyles.errorBox}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div style={authStyles.inputWrapper}>
            <Mail size={16} style={authStyles.inputIcon} />
            <input
              type="email"
              style={authStyles.input}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={authStyles.inputWrapper}>
            <Lock size={16} style={authStyles.inputIcon} />
            <input
              type="password"
              style={authStyles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={authStyles.submitBtn}>
            {loading ? "Authenticating..." : (isSignUp ? "Create account" : "Sign In")}
          </button>

          <div style={authStyles.footer}>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              style={authStyles.toggleBtn}
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </button>

            <div style={authStyles.dividerLine}><span>or</span></div>

            <button
              type="button"
              onClick={onSkipAuth}
              style={authStyles.skipBtn}
            >
              <Database size={12} />
              Use Local Storage Mode (Offline)
            </button>
          </div>
        </form>
      ) : (
        <div style={authStyles.localAction}>
          <button onClick={onSkipAuth} style={authStyles.launchBtn}>
            Launch Local Hub ⚡
          </button>
        </div>
      )}
    </div>
  );
}

const authStyles = {
  container: {
    padding: "10px 4px",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(10, 15, 28, 0.8)",
    backdropFilter: "blur(6px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    zIndex: 10,
    borderRadius: 24,
  },
  spinner: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "3px solid #1C2842",
    borderTopColor: "#38D9C9",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    color: "#38D9C9",
    fontWeight: 600,
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  logoText: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 14,
    fontWeight: 700,
    color: "#38D9C9",
    letterSpacing: 2,
  },
  title: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 20,
    fontWeight: 600,
    color: "#E7EDF5",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#8493AA",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  inputIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#5D8DC1",
  },
  input: {
    width: "100%",
    background: "#121A2B",
    border: "1px solid #1C2842",
    borderRadius: 12,
    color: "#E7EDF5",
    fontSize: 14,
    padding: "12px 14px 12px 42px",
    outline: "none",
    transition: "border-color 0.2s ease",
    ":focus": {
      borderColor: "#38D9C9",
    }
  },
  submitBtn: {
    background: "#F2A93B",
    color: "#0A0F1C",
    fontWeight: 700,
    fontSize: 13,
    padding: "12px 16px",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'IBM Plex Mono', monospace",
    boxShadow: "0 4px 12px rgba(242, 169, 59, 0.2)",
    marginTop: 6,
  },
  errorBox: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: 10,
    color: "#FF6B6B",
    fontSize: 12.5,
    padding: "10px 12px",
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    lineHeight: 1.4,
  },
  warningBox: {
    background: "rgba(242, 169, 59, 0.08)",
    border: "1px solid rgba(242, 169, 59, 0.2)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  warningHeader: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#F2A93B",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  warningText: {
    fontSize: 12,
    color: "#8493AA",
    lineHeight: 1.5,
  },
  guideBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    color: "#5D8DC1",
    alignSelf: "flex-start",
    padding: 0,
    marginTop: 4,
  },
  guideContent: {
    background: "#121A2B",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    fontSize: 11,
    color: "#8493AA",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    border: "1px solid #1C2842",
  },
  codeBlock: {
    fontFamily: "'IBM Plex Mono', monospace",
    background: "#0A0F1C",
    padding: "6px 8px",
    borderRadius: 4,
    color: "#38D9C9",
    overflowX: "auto",
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  toggleBtn: {
    fontSize: 12,
    color: "#5D8DC1",
    padding: 2,
  },
  dividerLine: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: 11,
    color: "#5D8DC1",
    fontFamily: "'IBM Plex Mono', monospace",
    "::before": {
      content: '""',
      flex: 1,
      height: 1,
      background: "#1C2842",
      marginRight: 10,
    },
    "::after": {
      content: '""',
      flex: 1,
      height: 1,
      background: "#1C2842",
      marginLeft: 10,
    }
  },
  skipBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#8493AA",
    padding: "6px 12px",
    borderRadius: 8,
    border: "1px solid #1C2842",
    background: "#121A2B",
  },
  localAction: {
    display: "flex",
    justifyContent: "center",
    marginTop: 8,
  },
  launchBtn: {
    background: "#38D9C9",
    color: "#0A0F1C",
    fontWeight: 700,
    fontSize: 13,
    padding: "12px 24px",
    borderRadius: 12,
    fontFamily: "'IBM Plex Mono', monospace",
    boxShadow: "0 4px 12px rgba(56, 217, 201, 0.2)",
    width: "100%",
  }
};
