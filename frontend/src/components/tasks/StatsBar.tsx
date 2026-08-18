import { useTaskStats } from "../../hooks/useTasks";
import { CheckCircle2, Circle, Timer, AlertTriangle } from "lucide-react";
import { StatsCardSkeleton } from "../ui/Skeleton";

export const StatsBar = () => {
  const { data, isFetching } = useTaskStats();
  const stats = data?.data?.stats;

  if (!stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: Circle,
      color: "text-gray-500 dark:text-gray-400",
      bg: "bg-gray-50 dark:bg-gray-800",
    },
    {
      label: "In Progress",
      value: stats.byStatus.IN_PROGRESS,
      icon: Timer,
      color: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Completed",
      value: stats.byStatus.DONE,
      icon: CheckCircle2,
      color: "text-green-500 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertTriangle,
      color: "text-red-500 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950",
    },
  ];

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 transition-opacity ${
        isFetching ? "opacity-70" : ""
      }`}
    >
      {statCards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4 hover:shadow-sm transition-shadow min-w-0"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {card.value}
            </span>
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon size={18} className={card.color} />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{card.label}</p>
        </div>
      ))}
    </div>
  );
};
