import { v4 as uuidv4 } from 'uuid';

export const TASK_PRIORITY = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const TASK_STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

/**
 * Structure of a task:
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   priority: string,
 *   status: string,
 *   dueDate: string (iso),
 *   recurrent: { freq: 'Daily'|'Weekly'|'Monthly', interval: number } | null,
 *   subtasks: [Task, ...],
 *   createdAt: string,
 *   updatedAt: string,
 * }
 */
export const initialState = {
  tasks: [],
  view: 'ALL',
  error: null,
};

// Helper: deep clone
function cloneTasks(tasks) {
  return tasks.map(task => ({
    ...task,
    subtasks: task.subtasks ? cloneTasks(task.subtasks) : [],
  }));
}

/**
 * PUBLIC_INTERFACE
 * Main reducer for task state management.
 */
export function taskReducer(state, action) {
  try {
    switch (action.type) {
      case 'ADD_TASK': {
        if (!action.payload.title || action.payload.title.trim().length < 3) {
          return { ...state, error: 'Task title must be at least 3 characters.' };
        }
        const newTask = {
          ...action.payload,
          id: uuidv4(),
          status: TASK_STATUS.TODO,
          priority: action.payload.priority || TASK_PRIORITY.MEDIUM,
          subtasks: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return {
          ...state,
          tasks: [...state.tasks, newTask],
          error: null,
        };
      }
      case 'ADD_SUBTASK': {
        const { parentId, ...subtask } = action.payload;
        // Recursively add subtask to the correct parent task
        function addToSubtasks(tasks) {
          return tasks.map(task =>
            task.id === parentId
              ? { ...task, subtasks: [...task.subtasks, { ...subtask, id: uuidv4(), status: TASK_STATUS.TODO, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] }
              : { ...task, subtasks: addToSubtasks(task.subtasks) }
          );
        }
        return { ...state, tasks: addToSubtasks(state.tasks), error: null };
      }
      case 'UPDATE_TASK': {
        const update = action.payload;
        function updateTask(tasks) {
          return tasks.map(t =>
            t.id === update.id
              ? { ...t, ...update, updatedAt: new Date().toISOString() }
              : { ...t, subtasks: updateTask(t.subtasks) }
          );
        }
        return { ...state, tasks: updateTask(state.tasks), error: null };
      }
      case 'DELETE_TASK': {
        function remove(tasks, id) {
          return tasks.filter(t => t.id !== id).map(t => ({ ...t, subtasks: remove(t.subtasks, id) }));
        }
        return { ...state, tasks: remove(state.tasks, action.payload.id), error: null };
      }
      case 'REORDER_TASKS': {
        // payload: reordered array of root-level tasks only
        return { ...state, tasks: cloneTasks(action.payload.tasks), error: null };
      }
      case 'CHANGE_VIEW': {
        // e.g., by filter, custom view
        return { ...state, view: action.payload.view, error: null };
      }
      case 'SET_ERROR': {
        return { ...state, error: action.payload.error };
      }
      case 'CLEAR_ERROR': {
        return { ...state, error: null };
      }
      default: {
        return state;
      }
    }
  } catch (err) {
    // Robust error catch
    return { ...state, error: `State error: ${err.message}` };
  }
}
