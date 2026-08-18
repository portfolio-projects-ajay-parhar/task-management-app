import { TaskFilters as ITaskFilters, TaskStatus, Priority } from "../../types";
import { Search, X } from "lucide-react";
import { TextInput } from "../ui/TextInput";
import { SelectInput } from "../ui/SelectInput";

interface TaskFiltersProps {
  filters: ITaskFilters;
  onFiltersChange: (filters: ITaskFilters) => void;
}

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

const priorityOptions = [
  { value: "", label: "All Priority" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const sortOptions = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc", label: "Oldest First" },
  { value: "dueDate:asc", label: "Due Date (Soon)" },
  { value: "dueDate:desc", label: "Due Date (Late)" },
  { value: "priority:desc", label: "Priority (High → Low)" },
  { value: "title:asc", label: "Title (A-Z)" },
];

export const TaskFiltersBar = ({
  filters,
  onFiltersChange,
}: TaskFiltersProps) => {
  const hasActiveFilters = filters.status || filters.priority || filters.search;

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      status: "",
      priority: "",
      search: "",
      page: 1,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <TextInput
        type="search"
        placeholder="Search tasks..."
        value={filters.search || ""}
        onChange={(e) =>
          onFiltersChange({ ...filters, search: e.target.value, page: 1 })
        }
        leftIcon={<Search size={16} />}
        aria-label="Search tasks"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-w-0">
        <SelectInput
          value={filters.status || ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              status: e.target.value as TaskStatus | "",
              page: 1,
            })
          }
          options={statusOptions}
          aria-label="Filter by status"
        />

        <SelectInput
          value={filters.priority || ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              priority: e.target.value as Priority | "",
              page: 1,
            })
          }
          options={priorityOptions}
          aria-label="Filter by priority"
        />

        <SelectInput
          value={`${filters.sortBy || "createdAt"}:${filters.sortOrder || "desc"}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(":");
            onFiltersChange({
              ...filters,
              sortBy,
              sortOrder: sortOrder as "asc" | "desc",
            });
          }}
          options={sortOptions}
          containerClassName="col-span-2 sm:col-span-1"
          aria-label="Sort tasks"
        />
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-1 self-start text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          title="Clear all filters"
        >
          <X size={14} />
          Clear
        </button>
      )}
    </div>
  );
};
