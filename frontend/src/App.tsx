export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-widest text-violet-600 mb-3">
          Monorepo ready
        </p>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Task Manager
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Frontend (Vite + React + Tailwind) and backend (Express + Prisma) are
          wired as npm workspaces. Next we will add auth, tasks, and the full UI
          from the project plan.
        </p>
      </div>
    </main>
  );
}
