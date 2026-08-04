import React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "this item",
  itemType = "item",
}) {
  if (!isOpen) return null;

  return createPortal(
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <AlertTriangle size={22} color="#EF4444" />
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} color="#94A3B8" />
          </button>
        </div>

        {/* Content */}
        <div style={styles.body}>
          <h3 style={styles.title}>Move to Trash Bin?</h3>
          <p style={styles.desc}>
            Are you sure you want to delete <strong style={{ color: "#F8FAFC" }}>"{title}"</strong>?
          </p>
          <div style={styles.typeBadge}>
            Category: <span style={{ color: "#F2A93B", textTransform: "capitalize" }}>{itemType}</span>
          </div>
          <p style={styles.subtext}>
            Don't worry! This item will be moved to your <strong style={{ color: "#38D9C9" }}>Recycle Bin</strong> in Profile &amp; Settings, where you can restore it back to this exact location anytime.
          </p>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={onConfirm} style={styles.deleteBtn}>
            <Trash2 size={15} /> Move to Trash
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(5, 10, 20, 0.88)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    background: "#0B132B",
    border: "1px solid #1E293B",
    borderRadius: 16,
    width: "100%",
    maxWidth: 440,
    padding: 24,
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 6,
    borderRadius: 8,
  },
  body: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#F8FAFC",
    margin: "0 0 8px 0",
  },
  desc: {
    fontSize: 13.5,
    color: "#CBD5E1",
    lineHeight: 1.5,
    margin: "0 0 10px 0",
  },
  typeBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: "#94A3B8",
    background: "#0F172A",
    border: "1px solid #1E293B",
    borderRadius: 6,
    padding: "4px 10px",
    display: "inline-block",
    marginBottom: 12,
  },
  subtext: {
    fontSize: 12,
    color: "#94A3B8",
    lineHeight: 1.45,
    margin: 0,
  },
  actions: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid #1E293B",
    borderRadius: 8,
    padding: "9px 16px",
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  deleteBtn: {
    background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    border: "none",
    borderRadius: 8,
    padding: "9px 18px",
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
  },
};
