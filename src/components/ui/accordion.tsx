
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
// ChevronDown is conditionally used in nation-generator.tsx now, not here by default.

import { cn } from "@/lib/utils"

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Root
      ref={ref}
      className={cn("w-full", className)} // Ensure it takes full width by default
      {...props}
    />
))
Accordion.displayName = AccordionPrimitive.Root.displayName


const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b-0", className)} // border-b removed, individual items will handle their styling
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
        "flex flex-1 items-center justify-between font-medium transition-all hover:no-underline", // Removed py-4 to allow custom padding by content
        // Chevron rotation logic can be handled by the consumer if they add a chevron
        // '[&[data-state=open]>svg.accordion-chevron]:rotate-180', 
        className
      )}
      {...props}
    >
      {children}
      {/* Chevron is removed from default trigger. Consumer can add their own. */}
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
    {/* Default pt-0, can be overridden */}
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

