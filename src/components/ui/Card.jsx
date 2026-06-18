import { cn } from '../../app/cn';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('rounded-xl border border-border bg-surface shadow-card', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, title, subtitle, action }) {
  return (
    <div className={cn('flex items-start justify-between p-5 border-b border-border', className)}>
      <div>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {subtitle && <p className="text-sm text-ink-2 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}
