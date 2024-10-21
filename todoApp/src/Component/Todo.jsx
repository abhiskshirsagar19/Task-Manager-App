import React, { useState } from "react";
import { format } from "date-fns";
import { handleSuccess, handleError } from "../utils"; // Import both functions
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Don't forget to import toast CSS

function Todo() {
  const [todos, setTodos] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState(""); // Due Date for new todo
  const [isEditing, setIsEditing] = useState(null);
  const [editTodo, setEditTodo] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editStatus, setEditStatus] = useState("Pending");

  // Function to add a new todo
  const addTodo = () => {
    try {
      if (newTodo.trim()) {
        const newTask = {
          id: Date.now(),
          task: newTodo,
          description: newDescription,
          dueDate: newDueDate
            ? format(new Date(newDueDate), "dd-MM-yyyy")
            : format(new Date(), "dd-MM-yyyy"),
          status: "Pending",
        };
        setTodos([...todos, newTask]);
        setNewTodo("");
        setNewDescription("");
        setNewDueDate("");
        handleSuccess("Todo added successfully!"); // Success toast
      } else {
        handleError("Task name cannot be empty!"); // Error toast for empty input
      }
    } catch (error) {
      handleError("Failed to add Todo!"); // Error toast for any other issues
    }
  };

  // Function to delete a todo
  const deleteTodo = (id) => {
    try {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
      handleSuccess("Todo deleted successfully!"); // Success toast
    } catch (error) {
      handleError("Failed to delete Todo!"); // Error toast
    }
  };

  // Function to edit a todo
  const handleEdit = (todo) => {
    setIsEditing(todo.id);
    setEditTodo(todo.task);
    setEditDescription(todo.description);
    setEditDueDate(todo.dueDate);
    setEditStatus(todo.status);
  };

  const updateTodo = (id) => {
    try {
      const updatedTodos = todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              task: editTodo,
              description: editDescription,
              dueDate: format(new Date(editDueDate), "dd-MM-yyyy"),
              status: editStatus,
            }
          : todo
      );
      setTodos(updatedTodos);
      setIsEditing(null);
      handleSuccess("Todo updated successfully!"); // Success toast
    } catch (error) {
      handleError("Failed to update Todo!"); // Error toast
    }
  };

  // Function to toggle task status
  const toggleStatus = (id) => {
    try {
      const updatedTodos = todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              status: todo.status === "Pending" ? "Completed" : "Pending",
            }
          : todo
      );
      setTodos(updatedTodos);
      handleSuccess("Status toggled successfully!"); // Success toast
    } catch (error) {
      handleError("Failed to toggle status!"); // Error toast
    }
  };

  // Filter tasks by status and date
  const filteredTodos = todos.filter((todo) => {
    const dateMatch = filterDate ? todo.dueDate === filterDate : true;
    const statusMatch =
      filterStatus === "All" ? true : todo.status === filterStatus;
    return dateMatch && statusMatch;
  });

  const pendingTasks = filteredTodos.filter(
    (todo) => todo.status === "Pending"
  );
  const completedTasks = filteredTodos.filter(
    (todo) => todo.status === "Completed"
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">Task Manager</h1>

      <div className="flex flex-col mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new task"
          className="border border-gray-300 p-2 rounded-md mb-4"
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Enter description"
          className="border border-gray-300 p-2 rounded-md mb-4"
        />
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          className="border border-gray-300 p-2 rounded-md mb-4"
        />
        <button
          onClick={addTodo}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500"
        >
          Add Todo
        </button>
      </div>

      <div className="flex space-x-4 mb-8">
        <div className="flex flex-col">
          <label className="font-semibold mb-2">Filter by Due Date:</label>
          <input
            type="date"
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-2">Filter by Status:</label>
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Pending Tasks */}
        <div className="p-4 bg-yellow-100 rounded-lg">
          <h2 className="font-semibold text-lg mb-4">Pending Tasks</h2>
          {pendingTasks.length > 0 ? (
            <ul>
              {pendingTasks.map((todo) =>
                isEditing === todo.id ? (
                  <div
                    key={todo.id}
                    className="bg-white shadow-lg p-4 rounded-md"
                  >
                    <h2 className="text-xl font-bold mb-4">Add New Task</h2>
                    <label className="font-semibold">Task Name:</label>
                    <input
                      type="text"
                      value={editTodo}
                      onChange={(e) => setEditTodo(e.target.value)}
                      placeholder="Enter task name"
                      className="border border-gray-300 p-2 rounded-md mb-4 w-full"
                    />
                    <label className="font-semibold">Description:</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Enter task description"
                      className="border border-gray-300 p-2 rounded-md mb-4 w-full"
                    />
                    <label className="font-semibold">Due Date:</label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="border border-gray-300 p-2 rounded-md mb-4 w-full"
                    />
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={editStatus === "Pending"}
                        onChange={() => setEditStatus("Pending")}
                        className="mr-2"
                      />
                      <label className="font-semibold">Is Pending</label>
                    </div>
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={editStatus === "Completed"}
                        onChange={() => setEditStatus("Completed")}
                        className="mr-2"
                      />
                      <label className="font-semibold">Is Completed</label>
                    </div>
                    <div className="flex justify-between">
                      <button
                        onClick={() => updateTodo(todo.id)}
                        className="bg-blue-500 text-white p-2 rounded-md"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(null)}
                        className="bg-red-500 text-white p-2 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <li key={todo.id} className="mb-2">
                    <div className="flex justify-between">
                      <span>
                        <strong>{todo.task}</strong> (Due: {todo.dueDate})
                      </span>
                      <div>
                        <button
                          onClick={() => handleEdit(todo)}
                          className="bg-blue-500 text-white p-1 rounded-md mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="bg-red-500 text-white p-1 rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="ml-4 text-sm text-gray-700">
                      {todo.description}
                    </p>
                    <button
                      onClick={() => toggleStatus(todo.id)}
                      className="text-sm bg-green-500 text-white p-1 rounded-md mt-2"
                    >
                      Mark as Completed
                    </button>
                  </li>
                )
              )}
            </ul>
          ) : (
            <p>No pending tasks</p>
          )}
        </div>

        {/* Completed Tasks */}
        <div className="p-4 bg-green-100 rounded-lg">
          <h2 className="font-semibold text-lg mb-4">Completed Tasks</h2>
          {completedTasks.length > 0 ? (
            <ul>
              {completedTasks.map((todo) => (
                <li key={todo.id} className="mb-2">
                  <div className="flex justify-between">
                    <span>
                      <strong>{todo.task}</strong> (Due: {todo.dueDate})
                    </span>
                    <div>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="bg-red-500 text-white p-1 rounded-md mr-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="ml-4 text-sm text-gray-700">
                    {todo.description}
                  </p>
                  <button
                    onClick={() => toggleStatus(todo.id)}
                    className="text-sm bg-yellow-500 text-white p-1 rounded-md mt-2"
                  >
                    Mark as Pending
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No completed tasks</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Todo;
