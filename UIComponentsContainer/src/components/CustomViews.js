import React from 'react';
import { useTaskContext } from '../context/TaskContext';

// PUBLIC_INTERFACE
/**
 * CustomViews renders buttons to filter/sort tasks by different custom views.
 */
export default function CustomViews() {
  const [state, dispatch] = useTaskContext();

  function setView(view) {
    dispatch({ type: 'CHANGE_VIEW', payload: { view } });
  }

  return (
    <div style={{ margin: "1.2em 0 0.6em" }}>
      <button className="btn" onClick={() => setView('ALL')} style={{ fontWeight: state.view === 'ALL' ? 'bold' : undefined }}>All</button>
      <button className="btn" onClick={() => setView('TODAY')} style={{ fontWeight: state.view === 'TODAY' ? 'bold' : undefined, marginLeft: 10 }}>Today</button>
      <button className="btn" onClick={() => setView('HIGH')} style={{ fontWeight: state.view === 'HIGH' ? 'bold' : undefined, marginLeft: 10 }}>High Priority</button>
      {/* extensibility: more views can be added here */}
    </div>
  );
}
