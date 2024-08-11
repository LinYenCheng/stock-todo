import React, { useCallback, useState } from "react";
import useLocalStorageState from "use-local-storage-state";

interface Task {
  id: number;
  description: string;
  completed: boolean;
  createdAt: number;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useLocalStorageState<Task[]>("tasks", {
    defaultValue: [],
  });
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [sortMode, setSortmode] = useState<boolean>(false);

  const handleAddTask = useCallback(() => {
    if (newTaskDescription.trim() !== "") {
      const newTask = {
        id: Date.now(),
        description: newTaskDescription,
        completed: false,
        createdAt: Date.now(),
      };
      setTasks([...tasks, newTask]);
      setNewTaskDescription("");
    }
  }, [tasks, newTaskDescription, setTasks]);

  const handleToggleComplete = useCallback(
    (id: number) => {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    },
    [tasks, setTasks]
  );

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditTask = (id: number) => {
    setEditingTaskId(id);
  };

  const handleEdit = (id: number, newDescription: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, description: newDescription } : task
      )
    );
  };

  const handleSaveEdit = () => {
    setEditingTaskId(null);
  };

  const toggleSort = () => {
    setSortmode(!sortMode);
  };

  const sortOrder = sortMode ? 1 : -1;

  const filteredTasks = tasks
    .filter((task) =>
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => sortOrder * (b.createdAt - a.createdAt));

  return (
    <div className="container">
      <h1 className="text-center">TODO</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks"
        />
        <button className="ms-1 btn btn-primary" onClick={toggleSort}>
          {sortMode ? "▲" : "▼"}
        </button>
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Add a new task"
        />
        <button className="ms-1 btn btn-primary" onClick={handleAddTask}>
          Add
        </button>
      </div>

      <ul className="list-group">
        {filteredTasks.map((task) => (
          <li key={task.id} className="list-group-item">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
              />
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  value={task.description}
                  onBlur={() => handleSaveEdit()}
                  onChange={(e) => handleEdit(task.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveEdit();
                    }
                  }}
                />
              ) : (
                <span
                  className={`form-check-label ${
                    task.completed ? "text-muted bg-light" : ""
                  }`}
                  onClick={() => handleEditTask(task.id)}
                >
                  {task.description}
                </span>
              )}
              <button
                className="btn btn-danger btn-sm float-end"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </button>
              <button
                className="btn btn-secondary btn-sm float-end me-2"
                onClick={() => handleEditTask(task.id)}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
