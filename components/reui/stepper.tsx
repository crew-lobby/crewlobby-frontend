"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type StepperState = "active" | "completed" | "inactive"

type StepperContextValue = {
  value: number
  setValue: (value: number) => void
}

const StepperContext = React.createContext<StepperContextValue | null>(null)

function useStepperContext() {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error("Stepper components must be used within <Stepper>")
  }
  return context
}

type StepperItemContextValue = {
  step: number
  state: StepperState
}

const StepperItemContext = React.createContext<StepperItemContextValue | null>(null)

function useStepperItemContext() {
  const context = React.useContext(StepperItemContext)
  if (!context) {
    throw new Error("This component must be used within <StepperItem>")
  }
  return context
}

type StepperProps = React.ComponentProps<"div"> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
}

function Stepper({
  value,
  defaultValue = 1,
  onValueChange,
  className,
  ...props
}: StepperProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const setValue = React.useCallback(
    (next: number) => {
      if (!isControlled) {
        setInternalValue(next)
      }
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  return (
    <StepperContext.Provider value={{ value: currentValue, setValue }}>
      <div data-slot="stepper" className={cn("w-full", className)} {...props} />
    </StepperContext.Provider>
  )
}

function StepperNav({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stepper-nav"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function StepperItem({
  step,
  className,
  ...props
}: React.ComponentProps<"div"> & { step: number }) {
  const { value } = useStepperContext()
  const state: StepperState =
    step === value ? "active" : step < value ? "completed" : "inactive"

  return (
    <StepperItemContext.Provider value={{ step, state }}>
      <div
        data-slot="stepper-item"
        data-state={state}
        className={cn(
          "group/step flex flex-1 items-center last:flex-none",
          className,
        )}
        {...props}
      />
    </StepperItemContext.Provider>
  )
}

function StepperTrigger({
  className,
  disabled,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { setValue } = useStepperContext()
  const { step } = useStepperItemContext()

  return (
    <button
      type="button"
      data-slot="stepper-trigger"
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 disabled:cursor-default",
        !disabled && "cursor-pointer",
        className,
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!disabled) setValue(step)
      }}
      {...props}
    />
  )
}

function StepperIndicator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { state } = useStepperItemContext()

  return (
    <div
      data-slot="stepper-indicator"
      data-state={state}
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
        className,
      )}
      {...props}
    />
  )
}

function StepperSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stepper-separator"
      className={cn("mx-3 h-px flex-1 bg-border", className)}
      {...props}
    />
  )
}

function StepperPanel({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="stepper-panel" className={className} {...props} />
}

function StepperContent({
  value: stepValue,
  className,
  ...props
}: React.ComponentProps<"div"> & { value: number }) {
  const { value } = useStepperContext()

  if (value !== stepValue) return null

  return <div data-slot="stepper-content" className={className} {...props} />
}

export {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
}