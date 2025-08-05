import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

// PUBLIC_INTERFACE
/**
 * AddTask component provides UI to add a new task or subtask.
 * @param {Object} props
 * @param {string=} props.parentId - Optional parent task ID for adding a subtask.
 */
export default function AddTask({ parentId, onDone }) {
  const [state, dispatch] = useTaskContext();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    recurrent: '',
    recurrenceInterval: 1,
  });
  const [showRecurrence, setShowRecurrence] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newTask = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      dueDate: form.dueDate,
      recurrent: showRecurrence && form.recurrent
        ? { freq: form.recurrent, interval: Number(form.recurrenceInterval) }
        : null,
    };
    dispatch({
      type: parentId ? 'ADD_SUBTASK' : 'ADD_TASK',
      payload: parentId ? { ...newTask, parentId } : newTask
    });
    setForm({ title: '', description: '', priority: 'Medium', dueDate: '', recurrent: '', recurrenceInterval: 1 });
    setShowRecurrence(false);
    if (onDone) onDone();
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit} style={{ margin: "1em 0", textAlign: 'left', maxWidth: 480 }}>
      <div>
        <input
          required
          type="text"
          name="title"
          placeholder={parentId ? 'New subtask title' : 'Task title'}
          minLength={3}
          value={form.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>
          Priority:
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Due Date:
          <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
        </label>
      </div>
      <div style={{ marginTop: '0.5em' }}>
        <label>
          <input type="checkbox" checked={showRecurrence} onChange={e => setShowRecurrence(e.target.checked)} />
          Recurring Task?
        </label>
        {showRecurrence && (
          <span style={{ marginLeft: 8 }}>
            <select name="recurrent" value={form.recurrent} onChange={handleChange}>
              <option value="">Select freq</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            every
            <input
              style={{ width: 50, margin: '0 4px' }}
              type="number"
              min={1}
              name="recurrenceInterval"
              value={form.recurrenceInterval}
              onChange={handleChange}
            />
            occurrence(s)
          </span>
        )}
      </div>
      <button className="btn" type="submit">{parentId ? 'Add Subtask' : 'Add Task'}</button>
    </form>
  );
}
