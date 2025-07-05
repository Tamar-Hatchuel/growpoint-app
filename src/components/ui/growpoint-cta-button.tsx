
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const growpointCTAButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transform hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#FFB4A2] text-white hover:bg-[#E5989B] active:bg-[#B5828C] shadow-sm hover:shadow-md",
        secondary: "bg-growpoint-soft text-growpoint-dark hover:bg-growpoint-primary hover:text-white",
        outline: "border border-[#FFB4A2] bg-transparent text-[#FFB4A2] hover:bg-[#FFB4A2] hover:text-white",
      },
      size: {
        default: "h-8 px-3 py-1.5",
        sm: "h-7 px-2 py-1",
        lg: "h-10 px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GrowpointCTAButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof growpointCTAButtonVariants> {
  asChild?: boolean
}

const GrowpointCTAButton = React.forwardRef<HTMLButtonElement, GrowpointCTAButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(growpointCTAButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
GrowpointCTAButton.displayName = "GrowpointCTAButton"

export { GrowpointCTAButton, growpointCTAButtonVariants }
