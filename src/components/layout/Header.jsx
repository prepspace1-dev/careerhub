import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Search, Sun, Moon, Flame, Edit2, Check, LogOut, Menu } from "lucide-react";

export function Header() {
  const { 
    theme, 
    toggleTheme, 
    setCommandPaletteOpen, 
    currentDay, 
    userStats, 
    userProfile, 
    updateDisplayName, 
    user, 
    logout,
    setMobileMenuOpen 
  } = useApp();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile?.displayName || "Sai");
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateDisplayName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const initialLetter = (userProfile?.displayName || "S").charAt(0).toUpperCase();
  const userEmail = user?.email || "Local Offline Mode";

  return (
    <header style={{
      height: "64px",
      borderBottom: "var(--glass-border)",
      background: "var(--bg-subtle)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      position: "sticky",
      top: 0,
      zIndex: 10
    }} className="app-header">
      {/* Left: Mobile Hamburger Menu Button & Search Launcher */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="mobile-hamburger-btn"
          title="Open Menu"
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--bg-card)",
            border: "var(--glass-border)",
            color: "var(--text-primary)"
          }}
        >
          <Menu size={20} />
        </button>

        {/* Search Launcher */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="header-search-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 14px",
            borderRadius: "10px",
            background: "var(--bg-card)",
            border: "var(--glass-border)",
            color: "var(--text-muted)",
            fontSize: "13px",
            width: "280px"
          }}
        >
          <Search size={15} />
          <span className="search-text-label" style={{ flex: 1, textAlign: "left" }}>Search topics, problems...</span>
          <kbd className="cmd-k-badge" style={{
            fontSize: "10px",
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: "4px",
            background: "var(--bg-input)",
            border: "var(--glass-border)",
            color: "var(--text-secondary)"
          }}>
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Active Day Indicator */}
        <div className="header-day-pill" style={{
          padding: "6px 12px",
          borderRadius: "8px",
          background: "rgba(99, 102, 241, 0.1)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          color: "var(--accent-indigo)",
          fontWeight: 700,
          fontSize: "12px"
        }}>
          Day {currentDay} of 30
        </div>

        {/* Streak Indicator */}
        <div className="header-streak-pill" style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "8px",
          background: "rgba(245, 158, 11, 0.1)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          color: "var(--accent-amber)",
          fontWeight: 700,
          fontSize: "12px"
        }}>
          <Flame size={14} />
          <span>{userStats.streak} Days</span>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--bg-card)",
            border: "var(--glass-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-primary)"
          }}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Profile Popover Container */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 12px 4px 4px",
              borderRadius: "9999px",
              background: "var(--bg-card)",
              border: "var(--glass-border)"
            }}
          >
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "9999px",
              background: "var(--accent-indigo)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "12px"
            }}>
              {initialLetter}
            </div>
            <span className="profile-name-text" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
              {userProfile?.displayName || "Sai"}
            </span>
          </button>

          {/* Profile Dropdown Popover */}
          {menuOpen && (
            <div style={{
              position: "absolute",
              right: 0,
              top: "44px",
              width: "240px",
              background: "var(--bg-card)",
              border: "var(--glass-border)",
              borderRadius: "14px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              zIndex: 50
            }}>
              {/* User Info */}
              <div style={{ borderBottom: "var(--glass-border)", paddingBottom: "10px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {userProfile?.displayName || "Sai"}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", wordBreak: "break-all" }}>
                  {userEmail}
                </div>
              </div>

              {/* Edit Name Option */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  Display Name
                </label>
                {isEditingName ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      autoFocus
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                      style={{
                        flex: 1,
                        background: "var(--bg-input)",
                        border: "var(--glass-border)",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        color: "var(--text-primary)",
                        outline: "none"
                      }}
                    />
                    <button onClick={handleSaveName} style={{ color: "var(--accent-emerald)" }}>
                      <Check size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingName(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      background: "var(--bg-input)",
                      fontSize: "12px",
                      color: "var(--text-secondary)"
                    }}
                  >
                    <span>{userProfile?.displayName || "Sai"}</span>
                    <Edit2 size={12} />
                  </button>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  background: "rgba(244, 63, 94, 0.1)",
                  color: "var(--accent-rose)",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "1px solid rgba(244, 63, 94, 0.2)",
                  marginTop: "4px"
                }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
