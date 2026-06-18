export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      {Icon && <div className="h-12 w-12 rounded-full bg-surface-2 flex items-center justify-center mb-3 text-ink-2"><Icon size={22} /></div>}
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {message && <p className="text-sm text-ink-2 mt-1 max-w-sm">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
