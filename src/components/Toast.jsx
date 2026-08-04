import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, RotateCcw, X } from "lucide-react";

export default function Toast({
  toast,
  onUndo,
  onClose,
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return createPortal(
    <div style={styles.toastContainer} className="fade-in">
      <div style={styles.content}>
        <Trash2 size={16} color="#F2A93B" />
        <span style={styles.text}>{toast.message || "Item moved to Trash Bin"}</span>
      </div>

      <div style={styles.actionRow}>
        {toast.canUndo && onUndo && (
          <button onClick={onUndo} style={styles.undoBtn}>
            <RotateCcw size={13} /> Undo
          </button>
        )}
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={14} color="#94A3B8" />
        </button>
      </div>
    </div>,
    document.body
  );
}

const styles = {
  toastContainer: {
    position: "fixed",
    bottom: 24,
    right: 24,
    background: "#0F172A",
    border: "1px solid #38D9C9",
    borderRadius: 12,
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    zIndex: 999999,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    maxWidth: 420,
  },
  content: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 13,
    fontWeight: 500,
    color: "#F8FAFC",
  },
  actionRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  undoBtn: {
    background: "rgba(56, 217, 201, 0.15)",
    border: "1px solid rgba(56, 217, 201, 0.4)",
    borderRadius: 6,
    padding: "4px 10px",
    color: "#38D9C9",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    padding: 4,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
};
