'use client'

import * as React from 'react'
import { C } from '@/lib/theme'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ==================== BUTTON VARIANTS (for shadcn compatibility) ====================

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        primary: 'text-white shadow',
        danger: 'text-white shadow',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        md: 'h-9 px-4 py-2',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant']
export type ButtonSize = VariantProps<typeof buttonVariants>['size']

// ==================== BUTTON COMPONENT ====================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'default' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'default'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }

// ==================== ICON BUTTON COMPONENT ====================

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

export function IconButton({ icon, size = 'md', style, children, ...props }: IconButtonProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { width: 28, height: 28, fontSize: 14 },
    md: { width: 36, height: 36, fontSize: 16 },
    lg: { width: 44, height: 44, fontSize: 18 },
  }

  return (
    <button
      style={{
        background: 'transparent',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: C.textMuted,
        transition: 'all 0.15s ease',
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {icon || children}
    </button>
  )
}
