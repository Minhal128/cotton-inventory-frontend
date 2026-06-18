import { cn } from '../../app/cn';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink placeholder:text-ink-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20',
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ className, children, ...props }) {
  return (
    <label className={cn('block text-sm font-medium text-ink mb-1.5', className)} {...props}>
      {children}
    </label>
  );
}

export function FormField({ label, required, error, children, className }) {
  return (
    <div className={cn('flex flex-col', className)}>
      {label && <Label className="mb-1.5">{label}{required && <span className="text-danger ml-0.5">*</span>}</Label>}
      {children}
      {error && <span className="text-xs text-danger mt-1">{error}</span>}
    </div>
  );
}
