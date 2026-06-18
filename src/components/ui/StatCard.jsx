import { cn } from '../../app/cn';
import { Card } from './Card';

export function StatCard({ title, value, icon: Icon, trend, accent = 'primary', suffix }) {
  const accents = {
    primary: 'bg-primary-soft text-primary',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
    danger: 'bg-danger-soft text-danger',
    info: 'bg-info-soft text-info',
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-2">{title}</p>
          <p className="text-2xl font-semibold text-ink mt-2">
            {value}
            {suffix && <span className="text-sm font-normal text-ink-2 ml-1">{suffix}</span>}
          </p>
          {trend && <p className="text-xs text-ink-2 mt-1">{trend}</p>}
        </div>
        {Icon && (
          <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', accents[accent])}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </Card>
  );
}
