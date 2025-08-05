import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { taskReducer, initialState } from './taskReducer';

// PUBLIC_INTERFACE
/**
 * Context to provide task state and dispatch function.
 */
export const TaskContext = createContext();

/**
 * Hook to use Task Context safely.
 * @returns {[state, dispatch]} The state and dispatch from TaskContext.
 */
export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be used within TaskProvider");
  return ctx;
}

// PUBLIC_INTERFACE
/**
 * TaskProvider wraps the app and provides state and actions.
 */
export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState, (init) => {
    // Try to load initial state from localStorage
    try {
      const persisted = window.localStorage.getItem('tasksState');
      if (persisted) return JSON.parse(persisted);
      return init;
    } catch (e) {
      return init;
    }
  });

  // Persist to localStorage on every state change
  useEffect(() => {
    window.localStorage.setItem('tasksState', JSON.stringify(state));
  }, [state]);

  // Error boundary alternative: propagate error via UI
  return (
    <TaskContext.Provider value={[state, dispatch]}>
      {children}
    </TaskContext.Provider>
  );
}
