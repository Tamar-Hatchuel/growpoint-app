
import * as React from "react"
import { cn } from "@/lib/utils"

export interface GrowpointInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const GrowpointInput = React.forwardRef<HTMLInputElement, GrowpointInputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border-2 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
            error 
              ? "border-red-500 focus-visible:border-red-500" 
              : "border-growpoint-dark focus-visible:border-growpoint-accent",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-growpoint-accent font-medium">{error}</p>
        )}
      </div>
    )
  }
)
GrowpointInput.displayName = "GrowpointInput"

export { GrowpointInput }
