// EditTaskModal.tsx
import { useState, useEffect } from "react";
import keys from "../constants/keys";

interface Props {
  onClose: () => void;
  task: {
    id: number;
    title: string;
    description: string;
    isComplete: boolean;
  };
}

const EditTaskModal: React.FC<Props> = ({ onClose, task }) => {
  const [editedTask, setEditedTask] = useState({
    title: task?.title || "",
    description: task?.description || "",
    isComplete: task?.isComplete || false,
  });

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        description: task.description,
        isComplete: task.isComplete,
      });
    }
  }, [task]);

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};
    if (editedTask.title.trim().length < 3)
      newErrors.title = "Title must be at least 3 characters.";
    if (editedTask.description.trim().length < 5)
      newErrors.description = "Description must be at least 5 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const value =
      e.target.name === "isComplete"
        ? e.target.value === "true"
        : e.target.value;

    setEditedTask({ ...editedTask, [e.target.name]: value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`${keys.APP_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}

          <label className="block font-medium mt-2">Description</label>
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}

          <label className="block font-medium mt-2">Status</label>
          <select
            name="isComplete"
            value={editedTask.isComplete.toString()}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="false">Not Completed</option>
            <option value="true">Completed</option>
          </select>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
