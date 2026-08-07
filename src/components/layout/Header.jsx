import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { dsaProblems } from "../../data/dsaData";
import { csAiTopics } from "../../data/csAiData";
import { projectsData } from "../../data/projectsData";
import { triggerStreakCelebration, playSuccessSound, toggleSound, isSoundEnabled } from "../../utils/effects";
import { Search, Sun, Moon, Flame, Edit2, Check, LogOut, Menu, Code2, BrainCircuit, Kanban, X, Volume2, VolumeX } from "lucide-react";

export function Header() {
  const { 
    theme, 
    toggleTheme, 
    currentDay, 
    userStats, 
    userProfile, 
    updateDisplayName, 
    user, 
    logout,
    setMobileMenuOpen,
    setActiveTab,
    setCurrentDay
  } = useApp();

  const userEmail = user?.email || "Local Offline Mode";
  const defaultEmailName = user?.email ? user.email.split("@")[0] : "Engineer";
  const currentDisplayName = userProfile?.displayName && userProfile.displayName !== "Sai" 
    ? userProfile.displayName 
    : defaultEmailName;

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentDisplayName);
  const [menuOpen, setMenuOpen] = useState(false);

  // Compact Header Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const menuRef = useRef(null);
  const searchRef = useRef(null);

  // Sync input when profile updates
  useEffect(() => {
    setNameInput(currentDisplayName);
  }, [currentDisplayName]);

  // Close popovers when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
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

  const initialLetter = currentDisplayName.charAt(0).toUpperCase();

  // Search Results Computation
  const cleanQuery = searchQuery.trim().toLowerCase();
  let searchResults = [];

  if (cleanQuery.length > 0) {
    const matchedDSA = dsaProblems
      .filter(p => p.title.toLowerCase().includes(cleanQuery) || p.topic.toLowerCase().includes(cleanQuery))
      .slice(0, 4)
      .map(p => ({ ...p, type: "dsa", icon: Code2, label: `Day ${p.day} • ${p.topic}` }));

    const matchedCS = csAiTopics
      .filter(t => t.title.toLowerCase().includes(cleanQuery) || t.area.toLowerCase().includes(cleanQuery))
      .slice(0, 4)
      .map(t => ({ ...t, type: "csai", icon: BrainCircuit, label: `Day ${t.day} • ${t.area}` }));

    const matchedProjects = projectsData
      .filter(p => p.title.toLowerCase().includes(cleanQuery) || p.subtitle.toLowerCase().includes(cleanQuery))
      .slice(0, 2)
      .map(p => ({ ...p, type: "projects", icon: Kanban, label: p.subtitle }));

    searchResults = [...matchedDSA, ...matchedCS, ...matchedProjects];
  }

  const handleSelectSearchResult = (item) => {
    if (item.day) {
      setCurrentDay(item.day);
    }
    setActiveTab(item.type);
    setSearchQuery("");
    setSearchOpen(false);
  };

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
      zIndex: 30
    }} className="app-header">
      {/* Left: Mobile Hamburger Menu & Compact Header Search Bar */}
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

        {/* Compact Cute Search Input with Instant Dropdown */}
        <div ref={searchRef} style={{ position: "relative" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            borderRadius: "9999px",
            background: "var(--bg-card)",
            border: searchOpen ? "1px solid var(--accent-indigo)" : "var(--glass-border)",
            width: "260px",
            transition: "all 0.2s ease",
            boxShadow: searchOpen ? "0 0 12px var(--glow-accent)" : "none"
          }}>
            <Search size={14} style={{ color: searchOpen ? "var(--accent-indigo)" : "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search topics, problems..."
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "12.5px",
                color: "var(--text-primary)",
                fontWeight: 500
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ color: "var(--text-muted)", padding: 0 }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Cute Live Search Results Dropdown */}
          {searchOpen && searchQuery.trim().length > 0 && (
            <div style={{
              position: "absolute",
              top: "44px",
              left: 0,
              width: "320px",
              background: "var(--bg-card)",
              backdropFilter: "blur(16px)",
              border: "var(--glass-border)",
              borderRadius: "14px",
              boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              zIndex: 50,
              maxHeight: "360px",
              overflowY: "auto"
            }}>
              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={`${item.type}-${item.id || idx}`}
                      onClick={() => handleSelectSearchResult(item)}
                      className="hover-lift"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "transparent",
                        textAlign: "left",
                        width: "100%"
                      }}
                    >
                      <div style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: "var(--bg-input)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent-indigo)"
                      }}>
                        <ItemIcon size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {item.label}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div style={{ padding: "16px", textAlign: "center", fontSize: "12.5px", color: "var(--text-muted)" }}>
                  No matching topics or problems found.
                </div>
              )}
            </div>
          )}
        </div>
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

        {/* Streak Indicator (Clickable for Celebration) */}
        <button
          onClick={() => {
            triggerStreakCelebration();
            playSuccessSound();
          }}
          className="header-streak-pill hover-lift"
          title="Click to celebrate your streak!"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "8px",
            background: "rgba(245, 158, 11, 0.15)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            color: "var(--accent-amber)",
            fontWeight: 700,
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          <Flame size={14} className="active-day-glow" style={{ borderRadius: "50%" }} />
          <span>{userStats.streak} Days 🔥</span>
        </button>

        {/* Sound Effects Toggle Button */}
        <button
          onClick={() => {
            const isMuted = !isSoundEnabled();
            toggleSound();
            if (isMuted) playSuccessSound();
          }}
          title={isSoundEnabled() ? "Sound Effects On (Click to Mute)" : "Sound Effects Off (Click to Enable)"}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--bg-card)",
            border: "var(--glass-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isSoundEnabled() ? "var(--accent-indigo)" : "var(--text-muted)"
          }}
        >
          {isSoundEnabled() ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

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
              background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))",
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
              {currentDisplayName}
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
              backdropFilter: "blur(16px)",
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
                  {currentDisplayName}
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
                    <span>{currentDisplayName}</span>
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

