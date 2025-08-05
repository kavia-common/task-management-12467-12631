import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// PUBLIC_INTERFACE
/**
 * TaskList renders the list of tasks, supports drag-and-drop reordering.
 */
export default function TaskList() {
  const [state, dispatch] = useTaskContext();
  const { tasks, view } = state;

  // Filtering/view logic (default: show all, can expand)
  function getVisibleTasks() {
    if (view === 'ALL') return tasks;
    if (view === 'TODAY') {
      return tasks.filter(t =>
        t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString()
      );
    }
    if (view === 'HIGH') {
      return tasks.filter(t => t.priority === 'High');
    }
    // Extend views as needed
    return tasks;
  }

  function onDragEnd(result) {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    const reordered = Array.from(getVisibleTasks());
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    dispatch({ type: 'REORDER_TASKS', payload: { tasks: reordered } });
  }

  const visibleTasks = getVisibleTasks();

  return (
    <section style={{ maxWidth: 600, margin: '2em auto', textAlign: 'left' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasklist">
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="task-list"
            >
              {visibleTasks.length === 0 ? (
                <p>No tasks to show.</p>
              ) : (
                visibleTasks.map((task, idx) => (
                  <Draggable key={task.id} draggableId={task.id} index={idx}>
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          marginBottom: 16,
                          ...provided.draggableProps.style
                        }}
                      >
                        <TaskItem task={task} />
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
}
