import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cva, type VariantProps } from 'class-variance-authority';

const statusBadgeVariants = cva(
  "inline-flex items-center font-medium capitalize",
  {
    variants: {
      status: {
        success: "bg-success/15 text-success hover:bg-success/25 border-success/20",
        warning: "bg-warning/15 text-warning hover:bg-warning/25 border-warning/20",
        destructive: "bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/20",
        info: "bg-info/15 text-info hover:bg-info/25 border-info/20",
        brand: "bg-primary/15 text-primary hover:bg-primary/25 border-primary/20",
        default: "bg-muted text-muted-foreground hover:bg-muted/80 border-border",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0 text-[10px]",
        lg: "px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      status: "default",
      size: "default",
    }
  }
);

export interface StatusBadgeProps extends Omit<React.ComponentProps<typeof Badge>, "variant">, VariantProps<typeof statusBadgeVariants> {
  label: string;
}

export function StatusBadge({ status, size, label, className, ...props }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={statusBadgeVariants({ status, size, className })} {...props}>
      {label}
    </Badge>
  );
}
