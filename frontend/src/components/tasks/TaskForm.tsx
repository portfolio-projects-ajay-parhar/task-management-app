import { useState, FormEvent } from "react";
import { CreateTaskPayload, Task, TaskStatus, Priority } from "../../types";
import { Button } from "../ui/Button";
import { TextInput } from "../ui/TextInput";
import { TextArea } from "../ui/TextArea";
import { SelectInput } from "../ui/SelectInput";
import { format } from "date-fns";

interface TaskFormProps {
  onSubmit: (payload: CreateTaskPayload) => void;
  isLoading: boolean;
  initialData?: Task;
  submitLabel?: string;
}

const statusOptions = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

const priorityOptions = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export const TaskForm = ({
  onSubmit,
  isLoading,
  initialData,
  submitLabel = "Create Task",
}: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: (initialData?.status || "TODO") as TaskStatus,
    priority: (initialData?.priority || "MEDIUM") as Priority,
    dueDate: initialData?.dueDate
      ? format(new Date(initialData.dueDate), "yyyy-MM-dd")
      : "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title is too long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Title"
        required
        placeholder="What needs to be done?"
        value={formData.title}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
        error={errors.title}
        autoFocus
      />

      <TextArea
        label="Description"
        placeholder="Add more details (optional)..."
        rows={3}
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput
          label="Status"
          value={formData.status}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              status: e.target.value as TaskStatus,
            }))
          }
          options={statusOptions}
        />

        <SelectInput
          label="Priority"
          value={formData.priority}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              priority: e.target.value as Priority,
            }))
          }
          options={priorityOptions}
        />
      </div>

      <TextInput
        label="Due Date"
        type="date"
        value={formData.dueDate}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
        }
        min={format(new Date(), "yyyy-MM-dd")}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
