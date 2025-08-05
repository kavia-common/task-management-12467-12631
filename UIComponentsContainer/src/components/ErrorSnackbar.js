import React, { useEffect, useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

// PUBLIC_INTERFACE
/**
 * ErrorSnackbar displays reducer errors and auto-dismisses them after timeout.
 */
export default function ErrorSnackbar() {
  const [state, dispatch] = useTaskContext();
  const [visible, setVisible] = useState(!!state.error);

  useEffect(() => {
    setVisible(!!state.error);
    if (state.error) {
      const timeout = setTimeout(() => {
        setVisible(false);
        dispatch({ type: 'CLEAR_ERROR' });
      }, 3500);
      return () => clearTimeout(timeout);
    }
  }, [state.error, dispatch]);

  if (!visible || !state.error) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 32,
      left: 0,
      right: 0,
      margin: "0 auto",
      maxWidth: 440,
      zIndex: 2500,
      background: "#e85140",
      color: "#fff",
      padding: 16,
      borderRadius: 8,
      boxShadow: "0 2px 10px #a77",
      textAlign: "center",
      fontWeight: 700,
    }}>
      {state.error}
    </div>
  );
}
