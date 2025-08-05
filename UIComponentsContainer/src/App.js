import React, { useState, useEffect } from 'react';
import './App.css';
import { TaskProvider } from './context/TaskContext';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import CustomViews from './components/CustomViews';
import ErrorSnackbar from './components/ErrorSnackbar';

// PUBLIC_INTERFACE
/** 
 * Main App component for Task Management. Hosts global theme logic,
 * context provider, and overall layout.
 */
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <TaskProvider>
      <div className="App">
        <header className="App-header">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <h1>Task Management</h1>
          <CustomViews />
          <AddTask />
        </header>
        <main>
          <TaskList />
        </main>
        <ErrorSnackbar />
      </div>
    </TaskProvider>
  );
}

export default App;
