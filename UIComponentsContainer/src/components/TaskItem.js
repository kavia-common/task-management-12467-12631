import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import AddTask from './AddTask';
import ModalConfirm from './ModalConfirm';

// PUBLIC_INTERFACE
/**
 * TaskItem renders a single task with all controls and inline editing.
 * @param {Object} props
 * @param {Object} props.task - Task object to render.
 */
export default function TaskItem({ task }) {
  const [, dispatch] = useTaskContext();
  const [editMode, setEditMode] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [edit, setEdit] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate || '',
  });

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Done";
  
  function handleEditChange(e) {
    const { name, value } = e.target;
    setEdit(ed => ({ ...ed, [name]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    dispatch({ type: 'UPDATE_TASK', payload: { ...task, ...edit } });
    setEditMode(false);
  }

  function handleStatusChange(e) {
    dispatch({ type: 'UPDATE_TASK', payload: { ...task, status: e.target.value } });
  }

  return (
    <div className={`task-item${isOverdue ? ' overdue' : ''}`} style={{ background: "#fff", borderRadius: 8, padding: 16, boxShadow: "0 2px 10px #eee" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button aria-label="Expand task details" onClick={() => setExpanded(exp => !exp)} style={{ marginRight: 8 }}>
          {expanded ? "▼" : "►"}
        </button>
        {editMode ? (
          <form onSubmit={handleSave} style={{ flex: 1 }}>
            <input
              required
              name="title"
              minLength={3}
              value={edit.title}
              onChange={handleEditChange}
              style={{ fontWeight: "bold", width: "60%" }}
            />
            <select name="priority" value={edit.priority} onChange={handleEditChange}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <input name="dueDate" type="date" value={edit.dueDate} onChange={handleEditChange}/>
            <button type="submit" className="btn">Save</button>
            <button type="button" className="btn" onClick={() => setEditMode(false)}>Cancel</button>
          </form>
        ) : (
          <>
            <span style={{ fontWeight: "bold", fontSize: 16, flex: 1 }}>
              {task.title}
            </span>
            <span style={{
              borderRadius: 4,
              padding: "0.2em 0.7em",
              marginLeft: 8,
              background: {
                High: "#ff4050",
                Medium: "#ffd940",
                Low: "#83cf4f"
              }[task.priority],
              color: "#222"
            }}>{task.priority}</span>
            <select value={task.status} onChange={handleStatusChange} style={{ marginLeft: 8 }}>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
            <button className="btn" onClick={() => setEditMode(true)} style={{ marginLeft: 8 }}>Edit</button>
            <button className="btn" onClick={() => setShowDelete(true)} style={{ marginLeft: 4, color: 'red' }}>Delete</button>
          </>
        )}
      </div>
      {expanded && (
        <>
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <em style={{ color: "#444" }}>Description:</em> {task.description || <span style={{color:'#ccc'}}>No description</span>}
          </div>
          <div>
            <em>Due: {task.dueDate ? task.dueDate : <span style={{ color: "#ccc" }}>None</span>}</em>
            {task.recurrent && (
              <span style={{marginLeft:8, color:'orange'}}>
                [Repeats: {task.recurrent.freq} every {task.recurrent.interval}]
              </span>
            )}
          </div>
          {task.subtasks && !!task.subtasks.length && (
            <div style={{ marginTop: 10, marginLeft: 20 }}>
              <strong>Subtasks:</strong>
              {task.subtasks.map(sub => (
                <TaskItem task={sub} key={sub.id} />
              ))}
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <AddTask parentId={task.id} onDone={() => setExpanded(true)} />
          </div>
        </>
      )}
      <ModalConfirm
        isOpen={showDelete}
        title={"Delete this task?"}
        desc={"This will permanently delete the task and all its subtasks."}
        onCancel={() => setShowDelete(false)}
        onConfirm={() => {
          dispatch({ type: 'DELETE_TASK', payload: { id: task.id } });
          setShowDelete(false);
        }}
      />
    </div>
  );
}
