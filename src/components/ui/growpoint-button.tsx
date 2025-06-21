
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const growpointButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-growpoint-primary text-white hover:bg-growpoint-accent active:bg-growpoint-dark",
        secondary: "bg-growpoint-soft text-growpoint-dark hover:bg-growpoint-primary hover:text-white",
        outline: "border border-growpoint-accent bg-transparent text-growpoint-dark hover:bg-growpoint-accent hover:text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GrowpointButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof growpointButtonVariants> {
  asChild?: boolean
}

const GrowpointButton = React.forwardRef<HTMLButtonElement, GrowpointButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(growpointButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
GrowpointButton.displayName = "GrowpointButton"

export { GrowpointButton, growpointButtonVariants }
