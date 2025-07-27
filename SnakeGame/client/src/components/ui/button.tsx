import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading = false, children, disabled, ...props }, ref) => {
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-500/25",
      outline: "border border-white/30 bg-transparent text-gray-200 hover:bg-white/10 hover:border-white/50",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 shadow-lg",
      ghost: "hover:bg-white/10 text-gray-300 hover:text-white",
      link: "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300",
      gradient: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-9 px-3 py-1 text-xs",
      lg: "h-12 px-8 py-3 text-base",
      icon: "h-10 w-10",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
          variants[variant],
          sizes[size],
          loading && "loading",
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <span className={loading ? "opacity-0" : "opacity-100"}>
          {children}
        </span>
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
