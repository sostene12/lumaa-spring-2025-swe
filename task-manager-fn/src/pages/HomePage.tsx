import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import keys from "../constants/keys";

// Task interface structure (When fetched)
interface Task {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    username: string;
  };
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [taskEdited, setTaskEdited] = useState<boolean>(false);
  const [taskCreated, setTaskCreated] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    isComplete: false,
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    // redirect to login page if token is not available
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, [navigate, taskCreated, taskEdited]);

  const fetchTasks = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const res = await fetch(`${keys.APP_URL}/tasks`, {
        headers: {
          token: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setTasks(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Do you want to delete this task?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${keys.APP_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          token: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete task");
      }
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Task Manager</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Task
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {isLoading ? (
        <p className="text-center text-lg font-semibold text-gray-600">
          Fetching tasks...
        </p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-lg font-semibold text-gray-600">
          No tasks available
        </p>
      ) : (
        <table className="w-full bg-white rounded shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Completed</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t">
                <td className="p-4">{task.title}</td>
                <td className="p-4">{task.description}</td>
                <td className="p-4">{task.isComplete ? "✅" : "❌"}</td>
                <td className="p-4">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => {
                      setSelectedTask(task);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <CreateTaskModal
          onClose={() => {
            setIsModalOpen(false);
            setTaskCreated((prev) => !prev);
          }}
        />
      )}
      {isEditModalOpen && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => {
            setIsEditModalOpen(false);
            setTaskEdited((prev) => !prev);
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
