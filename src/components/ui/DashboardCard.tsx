import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface DashboardCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  contentClassName?: string;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export function DashboardCard({
  title,
  subtitle,
  icon,
  action,
  children,
  className,
  contentClassName,
  footer,
  noPadding = false,
  ...props
}: DashboardCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md", className)} {...props}>
      {(title || subtitle || action || icon) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {icon && <div className="text-muted-foreground">{icon}</div>}
              {title && <CardTitle className="text-lg">{title}</CardTitle>}
            </div>
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
          </div>
          {action && <div>{action}</div>}
        </CardHeader>
      )}
      <CardContent className={cn(noPadding ? "p-0" : "pt-0", contentClassName)}>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="bg-muted/50 px-6 py-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
