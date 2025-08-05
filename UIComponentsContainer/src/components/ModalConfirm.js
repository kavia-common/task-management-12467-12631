import React from 'react';

// PUBLIC_INTERFACE
/**
 * ModalConfirm presents a confirmation modal for destructive actions.
 * @param {Object} props
 * @param {boolean} props.isOpen - If modal is open.
 * @param {string} props.title - Modal title.
 * @param {string} props.desc - Modal descriptive text.
 * @param {function} props.onCancel - Called on cancel.
 * @param {function} props.onConfirm - Called on confirmation.
 */
export default function ModalConfirm({ isOpen, title, desc, onCancel, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" tabIndex={-1} aria-modal="true" role="dialog" style={{
      position: "fixed", zIndex: 3000, top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div className="modal-content" style={{
        background: "#fff",
        borderRadius: 8,
        padding: 24,
        minWidth: 320,
        maxWidth: 400,
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)"
      }}>
        <h3>{title}</h3>
        <p>{desc}</p>
        <div style={{ marginTop: 18 }}>
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn" onClick={onConfirm} style={{ marginLeft: 12, color: 'red' }}>Yes, Confirm</button>
        </div>
      </div>
    </div>
  );
}
