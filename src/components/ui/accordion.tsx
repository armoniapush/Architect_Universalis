
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
// ChevronDown is removed as the new design doesn't explicitly show it on the card triggers.
// If needed for other accordion uses, it can be re-added or managed locally.

import { cn } from "@/lib/utils"

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? AccordionPrimitive.Root : "div" // Use div if asChild, else Root
  return (
    <Comp
      ref={ref}
      className={cn(className)} // Removed default 'w-full' to allow grid styling by parent
      {...props}
    />
  )
})
Accordion.displayName = AccordionPrimitive.Root.displayName


const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b-0", className)} // Removed border-b for card styling
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all [&[data-state=open]>svg.accordion-chevron]:rotate-180", // Added accordion-chevron class for specific targeting
        className
      )}
      {...props}
    >
      {children}
      {/* Chevron is removed from default trigger for the card UI. Can be added if a specific accordion needs it. */}
      {/* <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 accordion-chevron" /> */}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
