
import * as React from "react"
import { cn } from "@/lib/utils"

const GrowpointCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border bg-growpoint-card-bg text-card-foreground shadow-lg",
      className
    )}
    {...props}
  />
))
GrowpointCard.displayName = "GrowpointCard"

const GrowpointCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
GrowpointCardHeader.displayName = "GrowpointCardHeader"

const GrowpointCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight text-growpoint-dark",
      className
    )}
    {...props}
  />
))
GrowpointCardTitle.displayName = "GrowpointCardTitle"

const GrowpointCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-0 text-gray-700", className)} 
    {...props} 
  />
))
GrowpointCardContent.displayName = "GrowpointCardContent"

const GrowpointCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
GrowpointCardFooter.displayName = "GrowpointCardFooter"

export { 
  GrowpointCard, 
  GrowpointCardHeader, 
  GrowpointCardFooter, 
  GrowpointCardTitle, 
  GrowpointCardContent 
}
